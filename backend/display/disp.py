import fitz
from PIL import Image, ImageDraw
import os
from PIL import Image
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter


def highlight_pdf_violations(pdf_path, violations, output_pdf_path):
    colors = ["#ffa900", "#58cc00", "#cc0000", "#00ccaa", "#003dcc", "#8100cc"]
    cind = 0
    doc = fitz.open(pdf_path)
    image_paths = []
    
    # combine all instaedo of separate 
    for page_num in range(len(doc)):
        page = doc[page_num]
        zoom = 3
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

        for violation in violations:
            for viol in violation:
                # page = doc[page_num]
                instance = page.search_for(viol)
                
                # pix = page.get_pixmap()
                draw = ImageDraw.Draw(img)
                
                for inst in instance:
                    scaled_inst = [coord * zoom for coord in inst]

                    draw.rounded_rectangle(scaled_inst, radius=2, outline=colors[cind], width=3, )
            # cind+=1
        cind = 0
                
        image_paths.append(img)

    rgb_images = [im.convert("RGB") for im in image_paths]
    first = rgb_images[0]

    pdf_as_bytes = BytesIO()

    if len(rgb_images) > 1:
        first.save(pdf_as_bytes, format="PDF", save_all=True, append_images=rgb_images[1:])
    else:
        first.save(pdf_as_bytes, format="PDF")

    
    pdf_as_bytes.seek(0)
    return pdf_as_bytes

# def highlight_as_bin(pdf_path, violations, output_pdf_path):
#     reader = PdfReader(BytesIO("file_bytes"))
#     writer = PdfWriter()

#     for page in reader.pages:
#         writer.add_page(page)

#     output_bytes = BytesIO()
#     writer.write(output_bytes)
#     output_bytes.seek(0)
#     return output_bytes.getvalue()

if __name__ == "__main__":
    pdf_path = 'NCE1.pdf'
    violations = [["blood pressure", "African-American"], ["Harvey spectre", "July 18, 1972", "Caucasian"]]
    images = highlight_pdf_violations(pdf_path, violations,  "a.pdf")

