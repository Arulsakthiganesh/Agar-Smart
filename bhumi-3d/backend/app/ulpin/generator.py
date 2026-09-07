import hashlib
import io
import base64
import os

try:
    import qrcode
    HAS_QRCODE = True
except ImportError:
    HAS_QRCODE = False

STATE_CODES = {
    "Tamil Nadu": "TN",
    "Karnataka": "KA",
    "Maharashtra": "MH",
    "Delhi": "DL",
    "Telangana": "TS"
}

DISTRICT_CODES = {
    "Chennai": "CHN",
    "Coimbatore": "CBE",
    "Madurai": "MDU",
    "Bengaluru": "BLR"
}

LOCALITY_CODES = {
    "Adyar": "ADY",
    "Anna Nagar": "ANG",
    "Velachery": "VLC",
    "Mylapore": "MYL",
    "T. Nagar": "TNG"
}

def generate_3d_ulpin(
    state: str,
    district: str,
    locality: str,
    survey_number: str,
    parcel_number: str,
    building_id: str = None,
    floor_number: int = None,
    unit_number: str = None,
    lat: float = 0.0,
    lon: float = 0.0,
    elevation: float = 0.0
) -> str:
    """
    Standardized Prototype 3D ULPIN Generator format:
    IN-[STATE]-[DISTRICT]-[LOCALITY]-[PARCEL]-[BUILDING]-[FLOOR]-[UNIT]-[CHECKSUM]
    """
    st_code = STATE_CODES.get(state, "TN")
    dt_code = DISTRICT_CODES.get(district, "CHN")
    lc_code = LOCALITY_CODES.get(locality, locality[:3].upper() if locality else "GEN")
    
    clean_parcel = parcel_number.replace(" ", "").zfill(5) if parcel_number else "00001"
    bld_code = f"B{building_id.replace('BLD-', '').zfill(2)}" if building_id else "B00"
    flr_code = f"F{str(floor_number).zfill(2)}" if floor_number is not None else "F00"
    unit_code = f"U{unit_number.replace('Unit-', '').replace('A-', '').zfill(2)}" if unit_number else "U00"
    
    raw_str = f"IN-{st_code}-{dt_code}-{lc_code}-{clean_parcel}-{bld_code}-{flr_code}-{unit_code}"
    
    # Compute deterministic check digit
    checksum = hashlib.md5(f"{raw_str}-{lat}-{lon}-{elevation}".encode('utf-8')).hexdigest()[:2].upper()
    
    return f"{raw_str}-{checksum}"

def generate_qr_code_base64(data_string: str) -> str:
    """Generate QR code as base64 string for direct rendering in UI or PDF"""
    if HAS_QRCODE:
        try:
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=2,
            )
            qr.add_data(data_string)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="#0f172a", back_color="#ffffff")
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
            return f"data:image/png;base64,{img_str}"
        except Exception:
            pass
            
    # Fallback synthetic SVG/PNG placeholder data URI if qrcode not installed
    fake_qr = f'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#0f172a"/><text x="10" y="55" fill="#ffffff" font-size="10">QR:{data_string[:10]}</text></svg>'
    return f"data:image/svg+xml;base64,{base64.b64encode(fake_qr.encode()).decode()}"

