import torch
import os
import sys
from PIL import Image
import numpy as np

# Add backend to path to import model
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))
from model import SignatureModel, HybridSiameseNetwork

def test_hybrid_architecture():
    print("--- Testing CNN-CapsNet Hybrid Architecture ---")
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Device: {device}")
    
    # 1. Test Raw Model Forward Pass
    print("\n1. Testing forward_once...")
    model = HybridSiameseNetwork().to(device)
    dummy_input = torch.randn(2, 3, 224, 224).to(device)
    
    with torch.no_grad():
        output, fmap = model.forward_once(dummy_input)
    
    print(f"Output shape: {output.shape} (Expected: [2, 128])")
    print(f"Feature map shape: {fmap.shape}")
    
    assert output.shape == (2, 128), "Output shape mismatch!"
    print("✓ forward_once passed.")
    
    # 2. Test Full Model Initialization
    print("\n2. Initializing SignatureModel...")
    sig_model = SignatureModel()
    print("✓ SignatureModel initialized successfully.")
    
    # 3. Test Mock Training Step
    print("\n3. Testing training step (short run)...")
    # We use very few epochs and a small batch size for a quick check
    # We need to ensure we don't crash due to the in-place error
    try:
        # Create a tiny dummy dataset context if needed, but if the folder exists it will use it
        # Just run a single epoch with tiny batch
        result = sig_model.train(epochs=1, batch_size=8)
        print(f"Training result status: {result.get('status')}")
        
        if result.get('status') == 'success':
            print("✓ Training step successful (in-place error fixed).")
        else:
            print(f"! Training status message: {result.get('message')}")
    except Exception as e:
        print(f"✗ Training failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_hybrid_architecture()
