# utils/qr_decoder.py
import cv2
import numpy as np
from PIL import Image
import logging

logging.basicConfig(level=logging.INFO)

def decode_qr(file) -> str:
    """
    Decodes QR code from a file (FileStorage from Flask)
    Uses OpenCV QRCodeDetector, works on Windows without external DLLs.
    """
    try:
        image = np.array(Image.open(file).convert("RGB"))
        detector = cv2.QRCodeDetector()
        data, points, _ = detector.detectAndDecode(image)
        if not data:
            logging.warning("No QR code detected")
            return None
        logging.info(f"Decoded QR content: {data}")
        return data
    except Exception as e:
        logging.exception("QR decoding failed")
        return None