import cv2

def decode_qr(image_path):
    """
    Decodes QR code using OpenCV.
    Returns decoded string if found, else None.
    """

    try:
        img = cv2.imread(image_path)

        detector = cv2.QRCodeDetector()
        data, bbox, _ = detector.detectAndDecode(img)

        if bbox is not None and data:
            return data
        else:
            return None

    except Exception as e:
        print("QR Decode Error:", e)
        return None