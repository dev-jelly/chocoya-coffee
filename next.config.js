/** @type {import('next').NextConfig} */
const nextConfig = {
  // 서버 전용 패키지는 클라이언트 번들에 포함되지 않도록 설정
  webpack: (config, { isServer }) => {
    // 서버 사이드 렌더링 시에는 노드 모듈을 그대로 사용
    if (isServer) {
      return config;
    }

    // 클라이언트 측에서는 서버 전용 모듈을 빈 객체로 대체
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      net: false,
      tls: false,
      child_process: false,
      dns: false,
      'aws-sdk': false,
      'mock-aws-s3': false,
      nock: false,
      'fs.realpath': false,
    };

    return config;
  },
  // 기타 설정
  reactStrictMode: true,
};

module.exports = nextConfig; 