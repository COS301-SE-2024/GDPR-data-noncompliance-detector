namespace GDPR_Non_compliant_Detector;

public partial class loginPage : ContentPage
{
	public loginPage()
	{
		InitializeComponent();
	}
	string username = "admin";
	string password = "password";
	private async void OnSignInButtonClicked(object sender, EventArgs e)
    {
		string username = UsernameEntry.Text;
		string password = PasswordEntry.Text;
        //I want you to check if the user has entered the right username and right password 
        //if the user has entered the right username and password then display a message box saying "You have successfully logged in"
        //Then take the user to the HomePage

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            await DisplayAlert("Error", "Please enter both username and password.", "OK");
        }
        else if (username == this.username && password == this.password)
        {
            await DisplayAlert("Success", "You have successfully logged in", "OK");
            await Navigation.PushAsync(new HomePage());

        }
        else
        {
            await DisplayAlert("Error", "Invalid username or password.", "OK");
        }

    }
}