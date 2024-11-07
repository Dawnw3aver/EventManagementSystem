using System.Text;

namespace EventManagement.Application.Helpers
{
    public class EmailTemplateHelper
    {
        public static string GetEmailTemplate(string templateName, Dictionary<string, string> placeholders)
        {
            string template = GetHtmlTemplate(templateName);
            return ReplacePlaceholders(template, placeholders);
        }

        private static string ReplacePlaceholders(string template, Dictionary<string, string> placeholders)
        {
            var sb = new StringBuilder(template);

            foreach (var placeholder in placeholders)
            {
                sb.Replace($"{{{{{placeholder.Key}}}}}", placeholder.Value);
            }

            return sb.ToString();
        }

        static string GetHtmlTemplate(string fileName)
        {
            //// This will get the current PROJECT directory
            //string projectDirectory = Directory.GetParent(Environment.CurrentDirectory).FullName;
            ////string templateFolder = Path.Combine(projectDirectory, "EventManagement.Application", "EmailTemplates");
            //string templateFolder = "/src/EventManagement.Application/EmailTemplates";

            //string filePath = Path.Combine(templateFolder, fileName);

            //if (!Directory.Exists(templateFolder))
            //{
            //    throw new DirectoryNotFoundException($"Папка '{templateFolder}' не найдена.");
            //}

            //if (!File.Exists(filePath))
            //{
            //    throw new FileNotFoundException($"Файл '{fileName}' не найден в папке '{templateFolder}'.");
            //}
            //return File.ReadAllText(filePath);
            return "Test mail";
        }
    }
}
