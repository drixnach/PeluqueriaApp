using System.Net.Http.Json;
using System.Text.Json.Serialization;

namespace Pelu.Services

{
    public class CaptchaService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public CaptchaService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<bool>VerificarAsync(string token)
        {
            if(string.IsNullOrWhiteSpace(token)) return false;

            var secret = _config["Recaptcha:SecretKey"];
            var url= $"https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={token}";

            var response = await _httpClient.PostAsync(url, null);
            if (!response.IsSuccessStatusCode) return false;

            var resultado=await response.Content.ReadFromJsonAsync<RecaptchaResponse>();
            return resultado?.Success ?? false;
        }

        private class RecaptchaResponse
        {
            [JsonPropertyName("success")]
            public bool Success { get; set; }
        }
    }
}
