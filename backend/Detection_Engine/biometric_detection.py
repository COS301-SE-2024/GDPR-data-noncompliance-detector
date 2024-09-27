from transformers import DetrImageProcessor, DetrForObjectDetection
import torch
from PIL import Image
import sys
import os
import glob


# below added because of the relative import error
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

def resource_path(relative_path):                                                       #Uses hasttr here, just checking difference
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    
    else:
        return os.path.join(os.path.abspath("."), relative_path)
    
EXTRACTED_PDF_FOLDER = os.path.expanduser("~/Documents/GND/extracted_images/pdf_images")
os.makedirs(EXTRACTED_PDF_FOLDER, exist_ok=True)

EXTRACTED_DOCX_FOLDER = os.path.expanduser("~/Documents/GND/extracted_images/docx_images")
os.makedirs(EXTRACTED_DOCX_FOLDER, exist_ok=True)

EXTRACTED_XLSX_FOLDER = os.path.expanduser("~/Documents/GND/extracted_images/xlsx_images")
os.makedirs(EXTRACTED_XLSX_FOLDER, exist_ok=True)

# def create_directories():
#     directories = [
#         resource_path('./local_model'),
#         resource_path('./Detection_Engine/extracted_images/pdf_images'),
#         resource_path('./Detection_Engine/extracted_images/docx_images'),
#         resource_path('./Detection_Engine/extracted_images/xlsx_images')
#     ]
    
#     for directory in directories:
#         if not os.path.exists(directory):
#             os.makedirs(directory)

class biometric_detection:
    
    # def __init__(self):
        # create_directories()

    def save_model_local():
        processor = DetrImageProcessor.from_pretrained("facebook/detr-resnet-50", revision="no_timm")
        model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50", revision="no_timm")

        # processor.save_pretrained('./local_model/detr_image_processor')
        # model.save_pretrained('./local_model/detr_for_object_detection')

        local_model_path = resource_path('./local_model/detr_image_processor')
        local_model_model_path = resource_path('./local_model/detr_for_object_detection')
    
        processor.save_pretrained(local_model_path)
        model.save_pretrained(local_model_model_path)

    def biometric_detect_people(self, source):
        image = Image.open(source)
        if image.mode != 'RGB':
            image = image.convert('RGB')

        processor = DetrImageProcessor.from_pretrained("facebook/detr-resnet-50", revision="no_timm")
        model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50", revision="no_timm")
        # processor = DetrImageProcessor.from_pretrained(resource_path('local_model/detr_image_processor'), revision="no_timm")
        # model = DetrForObjectDetection.from_pretrained(resource_path('local_model/detr_for_object_detection'), revision="no_timm")
            
        inputs = processor(images=image, return_tensors="pt")
        outputs = model(**inputs)

        target_sizes = torch.tensor([image.size[::-1]])
        results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=0.8)[0]
        output = []

        for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
            box = [round(i, 2) for i in box.tolist()]
            output.append({"label": model.config.id2label[label.item()], "confidence": round(score.item(), 3)})

        print(output)
        return output

    def biometric_detect_all(self,pdf_path):
        # clean up folders
        if (pdf_path.endswith('.pdf')):
            # extract_images_from_pdf(pdf_path)

            # images = [f'./Detection_Engine/extracted_images/pdf_images/{i}' for i in os.listdir('./Detection_Engine/extracted_images/pdf_images')  if i.endswith('.png') or i.endswith('.jpg')]
            # images_dir = resource_path('./Detection_Engine/extracted_images/pdf_images')
            images_dir = EXTRACTED_PDF_FOLDER
            images = [os.path.join(images_dir, i) for i in os.listdir(images_dir) if i.endswith('.png') or i.endswith('.jpg')]
            
            output = []
            count = 0
            for image in images:
                count += 1
                output.append(self.biometric_detect_people(image))
            
            # png_files = glob.glob(os.path.join("./Detection_Engine/extracted_images/pdf_images", '*.png'))
            # png_files = glob.glob(os.path.join(resource_path('./Detection_Engine/extracted_images/pdf_images'), '*.png'))
            png_files = glob.glob(os.path.join(EXTRACTED_PDF_FOLDER, '*.png'))
            for file in png_files:
                os.remove(file)

            return count

        elif pdf_path.endswith('.docx'):
            # extract_images_from_docx(pdf_path)
            
            # images = [f'./Detection_Engine/extracted_images/docx_images/{i}' for i in os.listdir('./Detection_Engine/extracted_images/docx_images')  if i.endswith('.png') or i.endswith('.jpg')]
            # images_dir = resource_path('./Detection_Engine/extracted_images/docx_images')
            images_dir = EXTRACTED_DOCX_FOLDER
            images = [os.path.join(images_dir, i) for i in os.listdir(images_dir) if i.endswith('.png') or i.endswith('.jpg')]
            
            output = []
            count = 0
            for image in images:
                count += 1
                output.append(self.biometric_detect_people(image))
            
            # png_files = glob.glob(os.path.join("./Detection_Engine/extracted_images/docx_images", '*.png'))
            # png_files = glob.glob(os.path.join(resource_path('./Detection_Engine/extracted_images/docx_images'), '*.png'))
            png_files = glob.glob(os.path.join(EXTRACTED_DOCX_FOLDER, '*.png'))
            for file in png_files:
                os.remove(file)

            return count

        elif pdf_path.endswith('.xlsx'):
            # extract_images_from_excel(pdf_path)
            # images = [f'./Detection_Engine/extracted_images/xlsx_images/{i}' for i in os.listdir('./Detection_Engine/extracted_images/xlsx_images')  if i.endswith('.png') or i.endswith('.jpg')]
            # images = [f'extracted_images/xlsx_images/{i}' for i in os.listdir('extracted_images/xlsx_images')]
            
            # images_dir = resource_path('./Detection_Engine/extracted_images/xlsx_images')
            images_dir = EXTRACTED_XLSX_FOLDER
            images = [os.path.join(images_dir, i) for i in os.listdir(images_dir) if i.endswith('.png') or i.endswith('.jpg')]

            output = []
            count = 0
            for image in images:
                count += 1
                output.append(self.biometric_detect_people(image))
            
            # png_files = glob.glob(os.path.join("./Detection_Engine/extracted_images/xlsx_images", '*.png'))
            # png_files = glob.glob(os.path.join(resource_path('./Detection_Engine/extracted_images/xlsx_images'), '*.png'))
            png_files = glob.glob(os.path.join(EXTRACTED_XLSX_FOLDER, '*.png'))
            for file in png_files:
                os.remove(file)

            return count
        
        # directories = [
        #     "./Detection_Engine/extracted_images/xlsx_images",
        #     "./Detection_Engine/extracted_images/docx_images",
        #     "./Detection_Engine/extracted_images/pdf_images"
        # ]

        # for directory in directories:
        #     all_files = glob.glob(os.path.join(directory, '*'))
        #     for file in all_files:
        #         os.remove(file)

        return output



if __name__ == "__main__":
    # out = biometric_detect_people("../mockdata/p2.png")
    # print(out)

    # print(biometric_detect_eye("../mockdata/p2.png"))
    # save_model_local()

    # extract_images()
    # print(biometric_detect_all("../mockdata/excelWimages.xlsx"))
    # Example for accessing mock data if it's bundled with PyInstaller
    print(biometric_detect_all(resource_path("../mockdata/excelWimages.xlsx")))
    # extract_images_from_excel("../mockdata/excelWimages.xlsx")
