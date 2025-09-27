export class HealthResponse {
  message: string;
  timestamp: string;
  version: string;
}

export class NewRelayerHealthResponse {
  message: string;
  timestamp: string;
  uptime: string;
  version: string;
  supportedChains: SupportedChains[];
}

class SupportedChains {
  id: string;
  name: string;
  tokens: string[];
}
