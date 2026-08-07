package com.advance.hirfa.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

public class HmacUtil {

    private static final String HMAC_SHA256 = "HmacSHA256";

    public static boolean verifySignature(String rawPayload, String headerSignature, String secretKey) {
        if (rawPayload == null || headerSignature == null || secretKey == null) {
            return false;
        }
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    secretKey.getBytes(StandardCharsets.UTF_8),
                    HMAC_SHA256
            );
            mac.init(secretKeySpec);

            byte[] hmacBytes = mac.doFinal(rawPayload.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder();
            for (byte b : hmacBytes) {
                sb.append(String.format("%02x", b));
            }

            return sb.toString().equalsIgnoreCase(headerSignature.trim());
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            return false;
        }
    }
}