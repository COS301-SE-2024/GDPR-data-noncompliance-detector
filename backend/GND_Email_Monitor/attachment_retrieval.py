from pathlib import Path
import os
import win32com.client
from email2country import email2country
import time
import pythoncom

inbox = None
namespace = None
output_dir = None

EU_Countries = [
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", 
    "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", 
    "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", 
    "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", 
    "Iceland", "Liechtenstein", "Norway", "South Africa"
]

class OutlookMonitor:
    """Event handler class for monitoring new emails in Outlook."""
    def OnNewMailEx(self, receivedItemsIDs):
        """Triggered when new mail arrives in Outlook Inbox"""
        
        received_ids = receivedItemsIDs.split(',')
        for message_id in received_ids:
            try:
                message = namespace.GetItemFromID(message_id)
                if message.Parent.Name == "Inbox":
                    process_email(message)
            
            except Exception as e:
                print(f"Error retrieving message with ID {message_id}: {e}")

def process_email(email):
    try:
        sender_email_address = email.SenderEmailAddress
        domain = get_domain(sender_email_address)
        print(f"New email from domain: {domain}")                                           #For Logging - COMMENT OUT

        country_info = get_country_from_domain(domain)

        if country_info and country_info in EU_Countries:
            print(f"Country: {country_info} is in the EU. Attachment downloaded.")     #For Logging - COMMENT OUT
            download_attachments(email, output_dir, country_info)

        else:
            print(f"Country: {country_info} is not in the EU")                         #For Logging - COMMENT OUT 

    except Exception as e:
        print(f'Error processing mail: "{e}"')

def get_domain(email):
    return email.split('@')[-1].lower()

#Get country
def get_country_from_domain(domain):
    try:
        country_info = email2country(domain)
        return country_info
    except Exception as e:
        print(f"Error retrieving country information: {e}")
        return None

def download_attachments(email, output_dir, country_info):
    attachments = email.Attachments
    
    if attachments.Count > 0:
        for i in range(1, attachments.Count + 1):
            attachment = attachments.Item(i)
            file_name = attachment.FileName
            stem, suffix = os.path.splitext(file_name)
            
            country_suffix = f" - {country_info}" if country_info else ""
            attachment_filename = output_dir / f"{stem}{country_suffix}{suffix}"
        
            attachment.SaveAsFile(str(attachment_filename))
            print(f"Attachment saved to {attachment_filename}")
    else:
        print("No attachments found.")

def get_user_documents_folder():
    return Path(os.path.expanduser("~/Documents"))                  #Get the user's Documents folder path.

def main():
    global inbox, namespace, output_dir

    pythoncom.CoInitialize()

    output_dir = get_user_documents_folder() / "GND/outlook-uploads"        #App Folder to store the docs
    output_dir.mkdir(parents=True, exist_ok=True)

    outlook = win32com.client.DispatchWithEvents("Outlook.Application", OutlookMonitor)
    
    namespace = outlook.GetNamespace("MAPI")
    inbox = namespace.GetDefaultFolder(6)

    print(f"Monitoring Outlook inbox for new emails. Files will be saved to: {output_dir}")         #Keep Monitor Running
    
    try:
        while True:
            pythoncom.PumpWaitingMessages()
            time.sleep(1)
    finally:
        pythoncom.CoUninitialize()

if __name__ == "__main__":
    main()