namespace GDPR_Non_compliant_Detector
{
    public partial class MainPage : ContentPage
    {
        //int count = 0;

        public MainPage()
        {
            InitializeComponent();
        }

        private async void OnNavigateButtonClicked(object sender, EventArgs e)
        {
            //count++;

            //if (count == 1)
            //    CounterBtn.Text = $"Clicked {count} time";
            //else
            //    CounterBtn.Text = $"Clicked {count} times";

            //SemanticScreenReader.Announce(CounterBtn.Text);
            //I want you to display a message box with the text "You are aboutto log in now" when the user clicks the button
            //DisplayAlert("Alert", "You are about to log in now", "OK");
            await Navigation.PushAsync(new loginPage());
        }
    }

}
