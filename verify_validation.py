import os
import torch
from PIL import Image
import numpy as np
from backend.model import SignatureModel, SignatureDataset, DATASET_DIR

def test_validation_logic():
    print("Pre-requisite: Creating dummy validation structure...")
    val_dir = os.path.join(DATASET_DIR, "validation")
    val_gen = os.path.join(val_dir, "genuine")
    val_forg = os.path.join(val_dir, "forged")
    
    os.makedirs(val_gen, exist_ok=True)
    os.makedirs(val_forg, exist_ok=True)
    
    # Create a few dummy images if they don't exist
    def create_dummy_img(path, name):
        img_path = os.path.join(path, name)
        if not os.path.exists(img_path):
            img = Image.fromarray(np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8))
            img.save(img_path)
            print(f"Created dummy image: {img_path}")

    create_dummy_img(val_gen, "original_1_1.png")
    create_dummy_img(val_gen, "original_1_2.png")
    create_dummy_img(val_gen, "original_2_1.png")
    create_dummy_img(val_gen, "original_2_2.png")
    create_dummy_img(val_forg, "forgeries_1_1.png")
    create_dummy_img(val_forg, "forgeries_2_1.png")

    print("\nTesting Dataset loading...")
    dataset = SignatureDataset(DATASET_DIR, sub_dir="validation")
    print(f"Dataset found {len(dataset.genuine_images)} genuine and {len(dataset.forged_images)} forged images.")
    print(f"Genuine by ID: {dataset.genuine_by_id}")
    print(f"Forged by ID: {dataset.forged_by_id}")
    print(f"Created {len(dataset.pairs)} pairs.")

    assert len(dataset.pairs) > 0, "Should have created pairs from dummy images"

    print("\nTesting Model training with validation (mocking)...")
    model = SignatureModel()
    # Tiny training run
    result = model.train(epochs=1, batch_size=2)
    
    print("\nTraining Result:")
    print(result)
    
    if "history" in result:
        history = result["history"]
        if len(history) > 0:
            last_entry = history[-1]
            print(f"Last entry: {last_entry}")
            if "val_loss" in last_entry:
                print("✓ SUCCESS: Validation loss found in history!")
            else:
                print("! WARNING: Validation loss NOT found in history (did you add images to the validation folder?)")
    else:
        print("! ERROR: Training failed or no history returned")

if __name__ == "__main__":
    test_validation_logic()
