using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Globalization;
using Microsoft.ServiceBus.Messaging;
using Microsoft.ServiceBus;

namespace GenerateSAS
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("What is your service bus namespace?");
            string sbNamespace = Console.ReadLine();

            Console.WriteLine();
            Console.WriteLine("What is the Notification Hub name?");
            string sbPath = Console.ReadLine();

            Console.WriteLine();
            Console.WriteLine("What existing shared access policy would you like to use to generate your SAS? (press enter for 'DefaultFullSharedAccessSignature')");
            string sbPolicy = Console.ReadLine();
            if (sbPolicy.Length == 0) sbPolicy = "DefaultFullSharedAccessSignature";

            Console.WriteLine();
            Console.WriteLine("What is that policy's shared access key?");
            string sbKey = Console.ReadLine();

            Console.WriteLine();
            Console.WriteLine("When should this expire (MM/DD/YY HH, GMT)? (press enter for 10/31/2020 12:00)");
            string sbExpiry = Console.ReadLine();
            if (sbExpiry.Length == 0) sbExpiry = "10/31/2020 12";

            // convert the expiry date string into a timespan... 
            DateTime tmpDT;
            DateTime.TryParseExact(sbExpiry, "MM/dd/YY HH", null, DateTimeStyles.None, out tmpDT);
            TimeSpan expiry = DateTime.UtcNow.Subtract(tmpDT);

            Console.WriteLine();
            try
            {
                var serviceUri = ServiceBusEnvironment.CreateServiceUri("https", sbNamespace, sbPath).ToString().Trim('/');
                string generatedSaS = SharedAccessSignatureTokenProvider.GetSharedAccessSignature(sbPolicy, sbKey, serviceUri, expiry);
               
                Console.WriteLine("Your SAS is:\n{0}", generatedSaS);
                Console.WriteLine();
                Console.WriteLine("Copy the above generated key");
            }
            catch
            {
                Console.WriteLine("An error occured, please check the values you entered and try again");
            }
           
            
            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }
    }
}




