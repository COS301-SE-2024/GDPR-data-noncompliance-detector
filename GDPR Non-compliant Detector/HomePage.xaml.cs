using Microsoft.Maui.Storage;

namespace GDPR_Non_compliant_Detector;

public partial class HomePage : ContentPage
{
	public HomePage()
	{
		InitializeComponent();
	}

	private async void OnFilesButtonClicked(object sender, EventArgs e)
    {
        //await DisplayAlert("Files", "Files button clicked.", "Ok");
        try
        {
            var result = await FilePicker.Default.PickAsync(new PickOptions
            {
                PickerTitle = "Please select a file",
                FileTypes = FilePickerFileType.Pdf
            });

            if (result != null)
            {
                string filePath = result.FullPath;
                // Process the file path or file content as needed
                await DisplayAlert("File Selected", $"File path: {filePath}", "OK");
            }

        }
        catch (Exception ex)
        {
            // Handle any exceptions that occur
            await DisplayAlert("Error", ex.Message, "OK");
        }
    }

    private async void OnUserManualButtonClicked(object sender, EventArgs e)
    {
        await DisplayAlert("User-Manual", "User-manual button clicked.", "Ok");
    }

    private async void OnSettingsButtonClicked(object sender, EventArgs e)
    {
        await DisplayAlert("Settings", "Settings button clicked.", "Ok");
    }

    private async void OnHelpButtonClicked(object sender, EventArgs e)
    {
        await DisplayAlert("Help", "Help button clicked.", "Ok");
    }

    private async void OnDetailsClicked(object sender, EventArgs e)
    {
        await DisplayAlert("Details", "Details button clicked.", "Ok");
    }

    private async void OnScanClicked(object sender, EventArgs e)
    {
        await DisplayAlert("Scan", "Scan button clicked.", "Ok");
     
    }

    private async void OnExcelClicked(object sender, EventArgs e)
    {
        await DisplayAlert("Excel", "Excel button clicked.", "Ok");
    }

    private async void OnPDFClicked(object sender, EventArgs e)
    {
        await DisplayAlert("PDF", "PDF button clicked.", "Ok");
    }

    private async void OnWordClicked(object sender, EventArgs e)
    {
        await DisplayAlert("Word", "Word button clicked.", "Ok");

    }

    private async void OnExcelDownloadClicked(object sender, EventArgs e)
    {
        // Implement your logic here for the Excel button click
        await DisplayAlert("Excel Download Button Clicked", "Excel download button clicked.", "OK");
    }

    private async void OnPDFDownloadClicked(object sender, EventArgs e)
    {
        // Implement your logic here for the PDF button click
        await DisplayAlert("PDF Download Button Clicked", "PDF download button clicked.", "OK");
    }

    private async void OnWordDownloadClicked(object sender, EventArgs e)
    {
        // Implement your logic here for the Word button click
        await DisplayAlert("Word Download Button Clicked", "Word download button clicked.", "OK");
    }
}