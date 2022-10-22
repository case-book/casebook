package com.mindplates.bugcase.framework.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class JwtTokenProvider {

  private final UserDetailsService userDetailsService;
  @Value("${spring.jwt.secret}")
  private String secretKey;
  @Value("${spring.jwt.expireMinutes}")
  private Long expireMinutes;

  @PostConstruct
  protected void init() {
    secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
  }

  // Jwt 토큰 생성
  public String createToken(String userIdentifier, List<String> roles) {
    Claims claims = Jwts.claims().setSubject(userIdentifier);
    claims.put("roles", roles);
    Date now = new Date();
    return Jwts.builder()
        .setClaims(claims)
        .setIssuedAt(now)
        .setExpiration(new Date(now.getTime() + (expireMinutes * 1000 * 60)))
        .signWith(SignatureAlgorithm.HS256, secretKey)
        .compact();
  }

  /***
   * JWT 토큰으로부터 인증 정보 조회
   * @param token
   * @return
   */
  public Authentication getAuthentication(String token) {
    UserDetails userDetails = userDetailsService.loadUserByUsername(this.getUserIdentifier(token));
    return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
  }

  /***
   * JWT 코튼으로부터 사영자 식별값 조회
   * @param token
   * @return
   */
  public String getUserIdentifier(String token) {
    return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
  }

  /***
   * REQUEST HEADER에서 JWT 토큰 조회
   * @param req
   * @return
   */
  public String resolveToken(HttpServletRequest req) {
    return req.getHeader("X-AUTH-TOKEN");
  }

  /***
   * JWT 토큰 검증
   * @param jwtToken
   * @return
   */
  public boolean validateToken(String jwtToken) {
    try {
      Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(jwtToken);
      return !claims.getBody().getExpiration().before(new Date());
    } catch (Exception e) {
      return false;
    }
  }
}
