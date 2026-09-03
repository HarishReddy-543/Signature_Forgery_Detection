import cv2
import numpy as np
from PIL import Image

class HandCraftedFeatures:
    """
    Implements traditional Computer Vision features (Harris & SURF) 
    as described in Poddar et al. (2020) for hybrid signature verification.
    """
    
    def __init__(self):
        # Initialize SURF (ORB is used as a patent-free alternative to SURF/SIFT in OpenCV)
        # ORB (Oriented FAST and Rotated BRIEF) is robust and efficient.
        self.orb = cv2.ORB_create(nfeatures=500)
    
    def preprocess(self, image: Image.Image) -> np.ndarray:
        """Convert PIL Image to Grayscale Numpy Array"""
        img = np.array(image.convert('L'))
        return img

    def extract_harris_corners(self, image: Image.Image):
        """
        Detects sharp corners in the signature using Harris Corner Detection.
        Forged signatures often have more 'hesitation' points (corners) due to slower tracing.
        """
        try:
            img = self.preprocess(image)
            img = np.float32(img)
            
            # Harris detector parameters
            # block_size=2, ksize=3, k=0.04 are standard values
            dst = cv2.cornerHarris(img, 2, 3, 0.04)
            
            # Threshold for an optimal value, it may vary depending on the image.
            # We count points that are > 1% of the max intensity
            threshold = 0.01 * dst.max()
            
            # Count detected corners
            corners = np.count_nonzero(dst > threshold)
            
            # Normalize count roughly to 0-100 range for consistency
            # Typical signature might have 50-500 corners depending on complexity
            score = min(100, corners / 5) 
            
            return {
                "count": int(corners),
                "score": score,
                "valid": True
            }
        except Exception as e:
            print(f"Harris Extraction Error: {e}")
            return {"count": 0, "score": 0, "valid": False}

    def extract_surf_features(self, image: Image.Image):
        """
        Extracts keypoints using ORB (Open Source alternative to SURF).
        Matches similarity based on the number of consistent descriptors.
        """
        try:
            img = self.preprocess(image)
            
            # Find the keypoints and descriptors
            kp, des = self.orb.detectAndCompute(img, None)
            
            # v8.4 Fix: Strict Minimum Keypoint Requirement
            # If an image has < 5 keypoints, it's likely a blank page or too blurry to match.
            # We must flag it as invalid to prevent accidental 0-distance matches.
            if des is None or len(kp) < 5:
                print(f"⚠ ORB Extraction Warning: Insufficient keypoints ({len(kp) if kp else 0})")
                return {"count": len(kp) if kp else 0, "descriptors": None, "valid": False}
                
            return {
                "count": len(kp),
                "descriptors": des,
                "valid": True
            }
        except Exception as e:
            print(f"SURF/ORB Extraction Error: {e}")
            return {"count": 0, "descriptors": None, "valid": False}

    def compare_hybrid(self, img1: Image.Image, img2: Image.Image):
        """
        Compares two images using both Harris and SURF/ORB logic.
        Returns a similarity score (0-100).
        """
        # 1. Harris Comparison (Corner Density Match)
        h1 = self.extract_harris_corners(img1)
        h2 = self.extract_harris_corners(img2)
        
        harris_sim = 0
        if h1['valid'] and h2['valid'] and max(h1['count'], h2['count']) > 0:
            # Simple ratio similarity
            ratio = min(h1['count'], h2['count']) / max(h1['count'], h2['count'])
            harris_sim = ratio * 100

        # 2. SURF/ORB Comparison (Feature Matching)
        s1 = self.extract_surf_features(img1)
        s2 = self.extract_surf_features(img2)
        
        orb_sim = 0
        if s1['descriptors'] is not None and s2['descriptors'] is not None:
            # Use BFMatcher to find matches
            bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
            matches = bf.match(s1['descriptors'], s2['descriptors'])
            
            # Sort matches by distance
            matches = sorted(matches, key=lambda x: x.distance)
            
            # Similarity is based on number of good matches relative to total keypoints
            avg_kps = (s1['count'] + s2['count']) / 2
            if avg_kps > 0:
                orb_sim = min(100, (len(matches) / avg_kps) * 200) # Scaling factor

        # Weighted Average (Paper suggests combining them)
        # v8.2 Fix: Prioritize ORB (Shape/Texture) over Harris (Count)
        # Harris counts can vary wildly with pen pressure, but shape (ORB) must match.
        
        # CRITICAL VETO: If shape is totally different, score is 0.
        if orb_sim < 15.0:
            final_score = 0.0
        else:
            # 80% ORB (Shape), 20% Harris (Complexity)
            final_score = (harris_sim * 0.2) + (orb_sim * 0.8)
        
        return {
            "score": final_score,
            "harris_similarity": harris_sim,
            "orb_similarity": orb_sim,
            "details": {
                "harris_counts": [h1['count'], h2['count']],
                "orb_counts": [s1['count'], s2['count']]
            }
        }
