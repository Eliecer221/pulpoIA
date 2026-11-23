export interface SecurityTopic {
  id: string;
  category: string;
  name: string;
  description: string;
  items: any[];
}

export const SECURITY_FRAMEWORKS = [
  { id: 'owasp', name: 'OWASP Top 10', description: 'Las 10 vulnerabilidades web mas criticas', icon: '🛡️' },
  { id: 'mitre', name: 'MITRE ATT&CK', description: 'Framework de tecnicas adversarias', icon: '⚔️' },
  { id: 'nist', name: 'NIST Framework', description: 'Identify, Protect, Detect, Respond, Recover', icon: '🏛️' },
  { id: 'cis', name: 'CIS Controls', description: 'Controles de seguridad para defensa', icon: '🔒' },
  { id: 'pci', name: 'PCI DSS', description: 'Estandar de seguridad para pagos', icon: '💳' },
  { id: 'iso27001', name: 'ISO 27001', description: 'Gestion de seguridad de informacion', icon: '📋' },
];

export const CRYPTOGRAPHY = {
  symmetric: [
    { name: 'AES-256', description: 'Advanced Encryption Standard, 256-bit key', use: 'Encriptacion de datos' },
    { name: 'ChaCha20', description: 'Stream cipher de alta velocidad', use: 'Encripcion movil/realtime' },
    { name: '3DES', description: 'Triple DES (legacy)', use: 'Sistemas heredados' },
  ],
  asymmetric: [
    { name: 'RSA-4096', description: 'Rivest-Shamir-Adleman', use: 'Intercambio de claves, firmas' },
    { name: 'ECC P-256', description: 'Elliptic Curve Cryptography', use: 'SSL/TLS, blockchain' },
    { name: 'Ed25519', description: 'Edwards-curve Digital Signature', use: 'Firmas digitales' },
  ],
  hashing: [
    { name: 'SHA-256', description: 'Secure Hash Algorithm 256-bit', use: 'Integridad de datos' },
    { name: 'bcrypt', description: 'Password hashing adaptativo', use: 'Almacenamiento de passwords' },
    { name: 'Argon2', description: 'Password hashing moderno', use: 'Password hashing seguro' },
    { name: 'HMAC', description: 'Hash-based Message Authentication', use: 'Autenticacion de mensajes' },
  ],
  protocols: [
    { name: 'TLS 1.3', description: 'Transport Layer Security', use: 'Comunicacion segura' },
    { name: 'SSH', description: 'Secure Shell', use: 'Acceso remoto seguro' },
    { name: 'IPSec', description: 'IP Security', use: 'VPN, redes seguras' },
    { name: 'Kerberos', description: 'Autenticacion de red', use: 'Enterprise auth' },
  ],
};

export const WEB_SECURITY = [
  { name: 'SQL Injection', severity: 'critical', prevention: 'Prepared statements, ORM, validacion de entrada', description: 'Inyeccion de codigo SQL malicioso' },
  { name: 'XSS (Cross-Site Scripting)', severity: 'high', prevention: 'CSP, sanitizacion, HttpOnly cookies', description: 'Ejecucion de scripts maliciosos' },
  { name: 'CSRF', severity: 'high', prevention: 'Tokens CSRF, SameSite cookies', description: 'Falsificacion de peticiones' },
  { name: 'SSRF', severity: 'high', prevention: 'Validacion de URLs, network segmentation', description: 'Server-Side Request Forgery' },
  { name: 'XXE', severity: 'high', prevention: 'XML parser seguro, DTD deshabilitado', description: 'XML External Entity attack' },
  { name: 'Broken Authentication', severity: 'critical', prevention: 'MFA, rate limiting, session management', description: 'Autenticacion comprometida' },
  { name: 'Sensitive Data Exposure', severity: 'high', prevention: 'Encriptacion, masking, least privilege', description: 'Exposicion de datos sensibles' },
  { name: 'Broken Access Control', severity: 'critical', prevention: 'RBAC, ABAC, principle of least privilege', description: 'Control de acceso roto' },
  { name: 'Security Misconfiguration', severity: 'medium', prevention: 'Hardening, default configs, headers', description: 'Configuracion insegura' },
  { name: 'Insecure Deserialization', severity: 'critical', prevention: 'Validacion, type checking, sandbox', description: 'Deserializacion insegura' },
];

export const NETWORK_SECURITY = [
  { name: 'Firewall', description: 'Filtrado de trafico', types: ['Packet filter', 'Stateful', 'Application layer', 'NGFW'] },
  { name: 'IDS/IPS', description: 'Deteccion/Prevencion intrusiones', types: ['Network-based', 'Host-based', 'Signature', 'Anomaly'] },
  { name: 'VPN', description: 'Tunneling seguro', types: ['IPSec', 'SSL/TLS', 'WireGuard', 'OpenVPN'] },
  { name: 'Proxy', description: 'Intermediario seguro', types: ['Forward', 'Reverse', 'Transparent'] },
  { name: 'DNS Security', description: 'Proteccion DNS', types: ['DNSSEC', 'DoH', 'DoT', 'DNS filtering'] },
];

export const SYSTEM_HARDENING = {
  linux: [
    'SELinux/AppArmor enforcement',
    'Minimal attack surface (remove unused services)',
    'SSH key-only auth, disable root login',
    'Fail2ban for brute force protection',
    'Regular security updates',
    'Audit logging (auditd)',
    'Filesystem permissions (least privilege)',
    'Secure boot, disk encryption (LUKS)',
  ],
  windows: [
    'Windows Defender + Firewall',
    'BitLocker encryption',
    'LAPS for local admin passwords',
    'AppLocker/Software Restriction Policies',
    'PowerShell logging',
    'Credential Guard',
    'Device Guard',
    'Security baselines (CIS benchmarks)',
  ],
  cloud: [
    'IAM least privilege',
    'Encryption at rest and in transit',
    'VPC/network segmentation',
    'Security groups/NSGs',
    'CloudTrail/audit logging',
    'Secrets management (Vault, KMS)',
    'Compliance monitoring',
  ],
};

export const SECURE_CODING = [
  { language: 'Python', practices: ['Type hints', 'Input validation', 'No eval/exec', 'Safe subprocess', 'Secrets in env vars', 'SAST tools (Bandit)'] },
  { language: 'JavaScript/Node', practices: ['Input sanitization', 'No eval', 'CSP headers', 'Dependency scanning', 'Helmet.js', 'Rate limiting'] },
  { language: 'C/C++', practices: ['Bounds checking', 'No strcpy/sprintf', 'ASLR/DEP', 'Stack canaries', 'AddressSanitizer', 'Static analysis'] },
  { language: 'Java', practices: ['No deserialization untrusted', 'Prepared statements', 'Input validation', 'Security Manager', 'OWASP ESAPI'] },
  { language: 'Go', practices: ['No SQL string concat', 'Context timeouts', 'TLS config', 'Input validation', 'gosec'] },
];

export const THREAT_MODELING = {
  methodologies: [
    { name: 'STRIDE', description: 'Spoofing, Tampering, Repudiation, Info disclosure, DoS, Elevation' },
    { name: 'PASTA', description: 'Process for Attack Simulation and Threat Analysis' },
    { name: 'LINDDUN', description: 'Privacy-focused threat modeling' },
    { name: 'Attack Trees', description: 'Hierarchical attack modeling' },
  ],
  steps: [
    'Identify assets and trust boundaries',
    'Create data flow diagrams',
    'Identify threats per element',
    'Rate threats by risk',
    'Define mitigations',
    'Validate and iterate',
  ],
};

export const INCIDENT_RESPONSE = {
  phases: [
    { phase: 'Preparation', description: 'Equipos, herramientas, procedimientos' },
    { phase: 'Identification', description: 'Deteccion y analisis inicial' },
    { phase: 'Containment', description: 'Aislar y limitar dano' },
    { phase: 'Eradication', description: 'Eliminar causa raiz' },
    { phase: 'Recovery', description: 'Restaurar sistemas' },
    { phase: 'Lessons Learned', description: 'Mejora continua' },
  ],
  tools: [
    'SIEM (Splunk, ELK, Wazuh)',
    'EDR (CrowdStrike, SentinelOne)',
    'SOAR (Palo Alto, Swimlane)',
    'Digital Forensics (Autopsy, Volatility)',
  ],
};

export const COMPLIANCE = [
  { standard: 'GDPR', region: 'EU', focus: 'Data protection and privacy' },
  { standard: 'CCPA', region: 'California', focus: 'Consumer privacy' },
  { standard: 'HIPAA', region: 'US Healthcare', focus: 'Medical data protection' },
  { standard: 'PCI DSS', region: 'Global Payments', focus: 'Payment card security' },
  { standard: 'SOX', region: 'US Finance', focus: 'Financial reporting' },
  { standard: 'ISO 27001', region: 'Global', focus: 'Information security management' },
  { standard: 'SOC 2', region: 'Global', focus: 'Service organization controls' },
];

export const SECURITY_TOOLS = {
  scanning: ['Nmap', 'Masscan', 'Zmap', 'Nessus', 'OpenVAS', 'Qualys'],
  web: ['Burp Suite', 'OWASP ZAP', 'Nikto', 'SQLMap', 'Dirb', 'Gobuster'],
  forensics: ['Autopsy', 'Volatility', 'Wireshark', 'tcpdump', 'ELK Stack'],
  monitoring: ['Splunk', 'Wazuh', 'Security Onion', 'Zeek', 'Suricata'],
  siem: ['Splunk', 'ELK', 'Wazuh', 'Graylog', 'IBM QRadar'],
  iam: ['Keycloak', 'Okta', 'Auth0', 'AWS IAM', 'Azure AD'],
};