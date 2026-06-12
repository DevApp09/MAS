using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MAS.Utility
{
    public static class StringCipher
    {
        private const int KEY_SIZE = 256;

        private const int DerivationIterations = 1000;
        public static string DecodeToken(string token)
        {
            // Your custom token decoding logic goes here.
            // This is just a basic example; you may want to use a more secure approach.

            byte[] key = Encoding.UTF8.GetBytes("your_secret_key");
            byte[] tokenBytes = Convert.FromBase64String(token);

            using (var aesAlg = new AesCryptoServiceProvider())
            {
                aesAlg.Key = key;
                aesAlg.Mode = CipherMode.ECB;
                aesAlg.Padding = PaddingMode.PKCS7;

                using (var decryptor = aesAlg.CreateDecryptor())
                {
                    byte[] decryptedBytes = decryptor.TransformFinalBlock(tokenBytes, 0, tokenBytes.Length);
                    return Encoding.UTF8.GetString(decryptedBytes);
                }
            }
        }
        public static string Encrypt(this string plainText, string key)
        {
            key = "EncryptionKeyMAS@APP#";
            byte[] array = Generate256BitsOfRandomEntropy();
            byte[] array2 = Generate256BitsOfRandomEntropy();
            byte[] bytes = Encoding.UTF8.GetBytes(plainText);
            Rfc2898DeriveBytes rfc2898DeriveBytes = null;
            RijndaelManaged rijndaelManaged = null;
            try
            {
                rfc2898DeriveBytes = new Rfc2898DeriveBytes(key, array, 1000);
                byte[] bytes2 = rfc2898DeriveBytes.GetBytes(32);
                rijndaelManaged = new RijndaelManaged();
                rijndaelManaged.BlockSize = 256;
                rijndaelManaged.Mode = CipherMode.CBC;
                rijndaelManaged.Padding = PaddingMode.PKCS7;
                ICryptoTransform transform = rijndaelManaged.CreateEncryptor(bytes2, array2);
                MemoryStream memoryStream = new MemoryStream();
                CryptoStream cryptoStream = new CryptoStream(memoryStream, transform, CryptoStreamMode.Write);
                cryptoStream.Write(bytes, 0, bytes.Length);
                cryptoStream.FlushFinalBlock();
                byte[] first = array;
                first = first.Concat(array2).ToArray();
                first = first.Concat(memoryStream.ToArray()).ToArray();
                memoryStream.Close();
                cryptoStream.Close();
                return Convert.ToBase64String(first);
            }
            finally
            {
                rfc2898DeriveBytes?.Dispose();
            }
        }

        public static string Decrypt(this string cipherText, string key)
        {
            key = "EncryptionKeyMAS@APP#";
            byte[] array = Convert.FromBase64String(cipherText);
            byte[] salt = array.Take(32).ToArray();
            byte[] rgbIV = array.Skip(32).Take(32).ToArray();
            byte[] array2 = array.Skip(64).Take(array.Length - 64).ToArray();
            Rfc2898DeriveBytes rfc2898DeriveBytes = null;
            RijndaelManaged rijndaelManaged = null;
            try
            {
                rfc2898DeriveBytes = new Rfc2898DeriveBytes(key, salt, 1000);
                byte[] bytes = rfc2898DeriveBytes.GetBytes(32);
                rijndaelManaged = new RijndaelManaged();
                rijndaelManaged.BlockSize = 256;
                rijndaelManaged.Mode = CipherMode.CBC;
                rijndaelManaged.Padding = PaddingMode.PKCS7;
                ICryptoTransform transform = rijndaelManaged.CreateDecryptor(bytes, rgbIV);
                MemoryStream memoryStream = new MemoryStream(array2);
                CryptoStream cryptoStream = new CryptoStream(memoryStream, transform, CryptoStreamMode.Read);
                byte[] array3 = new byte[array2.Length];
                int count = cryptoStream.Read(array3, 0, array3.Length);
                memoryStream.Close();
                cryptoStream.Close();
                return Encoding.UTF8.GetString(array3, 0, count);
            }
            finally
            {
                rfc2898DeriveBytes?.Dispose();
            }
        }

        private static byte[] Generate256BitsOfRandomEntropy()
        {
            byte[] array = new byte[32];
            using (RNGCryptoServiceProvider rNGCryptoServiceProvider = new RNGCryptoServiceProvider())
            {
                rNGCryptoServiceProvider.GetBytes(array);
            }

            return array;
        }
    }
}
