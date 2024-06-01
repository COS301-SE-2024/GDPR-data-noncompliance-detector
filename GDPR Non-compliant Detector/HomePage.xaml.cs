namespace GDPR_Non_compliant_Detector;

public partial class HomePage : ContentPage
{
	public HomePage()
	{
		InitializeComponent();
	}

	private async void OnFilesButtonClicked(object sender, EventArgs e)
    {
		await DisplayAlert("Files", "Files button clicked.", "Ok");
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
        await DisplayAlert("Help", "help button clicked.", "Ok");
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
        await DisplayAlert("Pdf", "Pdf button clicked.", "Ok");
    }

    private async void OnWordClicked(object sender, EventArgs e)
    {
        await DisplayAlert("Word", "Word button clicked.", "Ok");
    }
}