package com.mindplates.bugcase.common.util;

import com.mindplates.bugcase.common.exception.ServiceException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class EncryptUtil {

    private final Random random = new Random();

    public static String maskString(String strText, int start, int end, char maskChar) {
        if (StringUtils.isEmpty(strText)) {
            return StringUtils.EMPTY;
        }

        if (start < 0) {
            start = 0;
        }

        if (end > strText.length()) {
            end = strText.length();
        }

        int maskLength = end - start;

        if (maskLength == 0) {
            return strText;
        }

        StringBuilder sbMaskString = new StringBuilder(maskLength);

        for (int i = 0; i < maskLength; i++) {
            sbMaskString.append(maskChar);
        }

        return strText.substring(0, start) + sbMaskString + strText.substring(start + maskLength);
    }

    public String getEncrypt(String source, byte[] salt) {
        String result;
        try {

            byte[] a = source.getBytes();
            byte[] bytes = new byte[a.length + salt.length];
            System.arraycopy(a, 0, bytes, 0, a.length);
            System.arraycopy(salt, 0, bytes, a.length, salt.length);

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(bytes);

            byte[] byteData = md.digest();

            StringBuilder sb = new StringBuilder();
            for (byte byteDatum : byteData) {
                sb.append(Integer.toString((byteDatum & 0xFF) + 256, 16).substring(1));
            }

            result = sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new ServiceException("error.failEncrypted");
        }

        return result;
    }

    public byte[] getSaltByteArray() {
        byte[] saltBytes = new byte[8];
        this.random.nextBytes(saltBytes);

        return saltBytes;
    }

    public String getSaltString(byte[] saltBytes) {
        return new java.math.BigInteger(saltBytes).toString(16);
    }
}

