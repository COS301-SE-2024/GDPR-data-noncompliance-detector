namespace GDPR_Non_compliant_Detector;

public partial class loginPage : ContentPage
{
	public loginPage()
	{
		InitializeComponent();
	}
	string username = "admin";
	// string pw = "pw";
	private async void OnSignInButtonClicked(object sender, EventArgs e)
    {
		string username = UsernameEntry.Text;
		// string pw = PasswordEntry.Text;
        //I want you to check if the user has entered the right username and right pw 
        //if the user has entered the right username and pw then display a message box saying "You have successfully logged in"
        //Then take the user to the HomePage

        if (string.IsNullOrWhiteSpace(username) )
        {
            await DisplayAlert("Error", "Please enter both username and pw.", "OK");
        }
        else if (username == this.username )
        {
            await DisplayAlert("Success", "You have successfully logged in", "OK");
            await Navigation.PushAsync(new HomePage());

        }
        else
        {
            await DisplayAlert("Error", "Invalid username or pw.", "OK");
        }

    }
}