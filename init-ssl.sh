#!/bin/bash
# 최초 1회만 실행 — SSL 인증서 발급
# 실행 전: 서버에서 포트 80이 열려 있어야 합니다

EMAIL="admin@myliz.co.kr"   # 이메일 주소 변경 가능
DOMAIN="myliz.co.kr"

echo ">>> SSL 인증서 발급 시작 (Let's Encrypt)"

docker run --rm \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  -p 80:80 \
  certbot/certbot certonly \
  --standalone \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  -d "admin.$DOMAIN" \
  -d "api.$DOMAIN"

if [ $? -eq 0 ]; then
  echo ""
  echo ">>> 인증서 발급 완료!"
  echo ">>> 이제 다음 명령어로 전체 서비스를 시작하세요:"
  echo ""
  echo "    docker compose up -d --build"
  echo ""
else
  echo ""
  echo ">>> 인증서 발급 실패. 다음을 확인하세요:"
  echo "  1. 도메인 DNS가 이 서버 IP를 가리키고 있는지"
  echo "  2. 포트 80이 방화벽에서 열려 있는지"
fi
