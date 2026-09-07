import io

try:
    import qrcode
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    HAS_REPORTLAB = True
except ImportError:
    HAS_REPORTLAB = False


def generate_ulpin_certificate_pdf(ulpin_data: dict) -> bytes:
    """
    Generates a high-quality PDF 3D ULPIN Spatial Rights Certificate
    """
    if not HAS_REPORTLAB:
        # Portable PDF fallback bytes header if reportlab is not installed
        ulpin_str = ulpin_data.get('ulpin', 'IN-TN-CHN-ADY-00482-B03-F07-U21-X7')
        raw_pdf = f"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>/Contents 4 0 R>>endobj 4 0 obj<</Length 120>>stream\nBT /F1 18 Tf 50 700 Td (BHUMI 3D ULPIN CERTIFICATE: {ulpin_str}) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\n0000000212 00000 n\ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n380\n%%EOF"
        return raw_pdf.encode('utf-8')

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    story = []
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        alignment=1, # Center
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Heading3'],
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#2563eb'),
        alignment=1,
        fontName='Helvetica-Bold'
    )

    h2_style = ParagraphStyle(
        'H2Style',
        parent=styles['Heading2'],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=12,
        spaceAfter=6,
        fontName='Helvetica-Bold'
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155')
    )

    header_data = [
        [Paragraph("<b>DEPARTMENT OF LAND RESOURCES (DoLR)</b><br/>Ministry of Rural Development, Government of India", subtitle_style)],
        [Paragraph("<b>BHUMI³D — OFFICIAL 3D ULPIN SPATIAL CERTIFICATE</b>", title_style)],
        [Paragraph("<i>Volumetric Cadastral & Vertical Ownership Identifier</i>", ParagraphStyle('ItalicSub', parent=subtitle_style, textColor=colors.HexColor('#64748b')))]
    ]
    
    header_table = Table(header_data, colWidths=[540])
    header_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 15))
    
    # ULPIN Highlight Box
    ulpin_str = ulpin_data.get('ulpin', 'IN-TN-CHN-ADY-00482-B03-F07-U21-X7')
    ulpin_box_data = [
        [Paragraph("<b>UNIQUE LAND PARCEL IDENTIFICATION NUMBER (3D ULPIN)</b>", ParagraphStyle('Label', parent=subtitle_style, textColor=colors.HexColor('#1e40af'), alignment=1))],
        [Paragraph(f"<font size=14 color='#0f172a'><b>{ulpin_str}</b></font>", ParagraphStyle('ULPIN', parent=title_style, alignment=1))]
    ]
    ulpin_table = Table(ulpin_box_data, colWidths=[540])
    ulpin_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#eff6ff')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#3b82f6')),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ]))
    story.append(ulpin_table)
    story.append(Spacer(1, 15))
    
    # Generate QR Code image in memory
    try:
        import qrcode
        qr = qrcode.QRCode(version=1, box_size=4, border=1)
        qr.add_data(f"BHUMI3D:ULPIN:{ulpin_str}")
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="#0f172a", back_color="#ffffff")
        qr_buffer = io.BytesIO()
        qr_img.save(qr_buffer, format="PNG")
        qr_buffer.seek(0)
        rl_qr_image = RLImage(qr_buffer, width=90, height=90)
    except Exception:
        # Fallback text if qrcode module not present
        rl_qr_image = Paragraph(f"<b>QR CODE</b><br/>{ulpin_str[:12]}...", ParagraphStyle('QRText', parent=body_style, fontSize=8, alignment=1))

    
    # Details Grid
    details_data = [
        [Paragraph("<b>Spatial Level:</b>", body_style), Paragraph(ulpin_data.get('spatial_level', 'Vertical Unit (Apartment)'), body_style), rl_qr_image],
        [Paragraph("<b>State / District:</b>", body_style), Paragraph(f"{ulpin_data.get('state', 'Tamil Nadu')} / {ulpin_data.get('district', 'Chennai')}", body_style), ""],
        [Paragraph("<b>Locality / Ward:</b>", body_style), Paragraph(ulpin_data.get('locality', 'Adyar (Ward 174)'), body_style), ""],
        [Paragraph("<b>Survey / Parcel ID:</b>", body_style), Paragraph(ulpin_data.get('parcel_id', 'SY-104/2A (PCL-0001)'), body_style), ""],
        [Paragraph("<b>Building Name / ID:</b>", body_style), Paragraph(ulpin_data.get('building_name', 'BHUMI Residency (BLD-0001)'), body_style), ""],
        [Paragraph("<b>Floor & Unit ID:</b>", body_style), Paragraph(f"Floor {ulpin_data.get('floor_number', 7)} | Unit {ulpin_data.get('unit_number', 'A-703')}", body_style), ""],
        [Paragraph("<b>Geo-Coordinates:</b>", body_style), Paragraph(f"{ulpin_data.get('latitude', 13.0067):.6f}° N, {ulpin_data.get('longitude', 80.2206):.6f}° E", body_style), ""],
        [Paragraph("<b>Elevation Above MSL:</b>", body_style), Paragraph(f"{ulpin_data.get('elevation', 33.5):.1f} meters", body_style), ""],
        [Paragraph("<b>Verification Status:</b>", body_style), Paragraph("<font color='#16a34a'><b>✓ VERIFIED 3D CADASTRAL RECORD</b></font>", body_style), ""]
    ]
    
    details_table = Table(details_data, colWidths=[130, 290, 120])
    details_table.setStyle(TableStyle([
        ('SPAN', (2, 0), (2, 8)), # Span QR Code down the side
        ('ALIGN', (2, 0), (2, 8), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f8fafc')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(details_table)
    story.append(Spacer(1, 20))
    
    # Official Disclaimer
    disclaimer_text = (
        "<b>OFFICIAL NOTICE:</b> BHUMI³D is a prototype developed for Smart India Hackathon 2026. "
        "This volumetric certificate establishes 3D spatial boundaries and air-rights topology under the National Land Records Modernization Programme (NLRMP)."
    )
    story.append(Paragraph(disclaimer_text, ParagraphStyle('Disclaimer', parent=body_style, fontSize=8, leading=11, textColor=colors.HexColor('#64748b'))))
    
    doc.build(story)
    return buffer.getvalue()
