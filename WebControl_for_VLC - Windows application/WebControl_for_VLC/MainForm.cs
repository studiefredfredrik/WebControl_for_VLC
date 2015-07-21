using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WebControl_for_VLC
{
    public partial class MainForm : Form
    {
        string url;
        int port;
        int interval;
        public MainForm()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            // Initialize main form
            tmrService.Enabled = false;
            linkLabel1.Links.Add(0, linkLabel1.Text.Length, "http://github.com/studiefredfredrik");
            url = Properties.Settings.Default.url;
            port = Properties.Settings.Default.port;
            interval = Properties.Settings.Default.interval;
            txtUrl.Text = url;
            txtPort.Text = port.ToString();
            txtInterval.Text = interval.ToString();
        }

        private void linkLabel1_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            // Open default web browser and show link to project homepage
            System.Diagnostics.Process.Start(e.Link.LinkData.ToString());
        }

        private void btnStartService_Click(object sender, EventArgs e)
        {
            if (btnStartService.Text == "Start service")
            {
                // Do simple error check of the url
                if (txtUrl.Text.Contains("http://")) url = txtUrl.Text;
                else
                {
                    url = "http://" + txtUrl.Text;
                    txtUrl.Text = url;
                }

                // Also save to persisted storage when starting service
                port = Convert.ToInt32(txtPort.Text);
                interval = Convert.ToInt32(txtInterval.Text);
                Properties.Settings.Default.url = url;
                Properties.Settings.Default.port = port;
                Properties.Settings.Default.interval = interval;
                tmrService.Interval = interval;
                tmrService.Enabled = true;
                btnStartService.Text = "Stop service";
            }
            else
            {
                btnStartService.Text = "Start service";
                tmrService.Enabled = false;
            }
        }

        private void tmrService_Tick(object sender, EventArgs e)
        {
            // Check with webservice if there are any new commands
            string json = new WebClient().DownloadString(url + ":" + port + "/commandlist");
            string[] words = json.Split('"');

            // Valid commands triggers focus on vlc followed by keyboard presses
            foreach (string s in words)
            {
                if (s == "pause")
                {
                    getFocusOnVLC();
                    SendKeys.Send(" ");
                }
                if (s == "FFWD")
                {
                    getFocusOnVLC();
                    SendKeys.Send("^{RIGHT}");
                }
                if (s == "RRWD")
                {
                    getFocusOnVLC();
                    SendKeys.Send("^{LEFT}");
                }
                if (s == "FWD")
                {
                    getFocusOnVLC();
                    SendKeys.Send("+{RIGHT}");
                }
                if (s == "RWD")
                {
                    getFocusOnVLC();
                    SendKeys.Send("+{LEFT}");
                }
                if (s == "quit")
                {
                    getFocusOnVLC();
                    SendKeys.Send("%{F4}");
                }
            }
        }

        // Using windows interop to allow for setting the active window
        [DllImport("user32.dll", CharSet = CharSet.Auto, ExactSpelling = true)]
        static extern bool SetForegroundWindow(IntPtr hWnd);
        public bool getFocusOnVLC()
        {
            Process[] processList = Process.GetProcesses();
            foreach (Process theProcess in processList)
            {
                string processName = theProcess.ProcessName;
                string mainWindowTitle = theProcess.MainWindowTitle;
                if (processName == "vlc")
                {
                    SetForegroundWindow(theProcess.MainWindowHandle);
                    return true;
                }
            }
            return false;
        }

        private void niTaskbar_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            // Show the form if taskbar icon is doubble clicked
            Show();
            WindowState = FormWindowState.Normal;
        }

        private void MainForm_SizeChanged(object sender, EventArgs e)
        {
            // Hide the form when minimized
            if (FormWindowState.Minimized == WindowState)
                Hide();
        }
    }
}
