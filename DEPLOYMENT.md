# Deployment Guide - SNFT Marketplace

Complete step-by-step guide for deploying the SNFT Marketplace to production.

## Table of Contents
1. [Smart Contract Deployment](#smart-contract-deployment)
2. [Frontend Deployment](#frontend-deployment)
3. [Post-Deployment Configuration](#post-deployment-configuration)
4. [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Smart Contract Deployment

### Prerequisites
- Clarinet CLI installed
- Stacks wallet with sufficient STX (0.45 STX for 3 contracts)
- Access to Stacks blockchain (mainnet or testnet)

### Step 1: Test Contracts
```bash
cd nft-market-place
clarinet check
clarinet test
```

Ensure all tests pass before deployment.

### Step 2: Generate Deployment Plan
```bash
clarinet deployment generate --mainnet
```

This creates deployment configuration in `deployments/default.mainnet-plan.yaml`

### Step 3: Configure Deployment
Edit the deployment plan:
```yaml
---
id: 0
name: SNFT Marketplace Deployment
network: mainnet
stacks-node: "https://api.mainnet.hiro.so"
bitcoin-node: "http://localhost:8332"
plan:
  batches:
    - id: 0
      transactions:
        - contract-publish:
            contract-name: nft-token
            expected-sender: SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F
            cost: 150000
            path: contracts/nft-token.clar
        - contract-publish:
            contract-name: marketplace
            expected-sender: SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F
            cost: 150000
            path: contracts/marketplace.clar
        - contract-publish:
            contract-name: royalty-distributor
            expected-sender: SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F
            cost: 150000
            path: contracts/royalty-distributor.clar
```

### Step 4: Deploy Contracts
```bash
clarinet deployment apply --mainnet
```

Follow the prompts to confirm deployment with your Stacks wallet.

### Step 5: Verify Deployment
Visit the Stacks Explorer to verify your contracts:
```
https://explorer.stacks.co/txid/[transaction-id]?chain=mainnet
```

Check each contract:
```
https://explorer.stacks.co/address/SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F?chain=mainnet
```

### Contract Addresses
After deployment, note down your contract addresses:
- NFT Token: `SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.nft-token`
- Marketplace: `SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.marketplace`
- Royalty Distributor: `SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.royalty-distributor`

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### Prerequisites
- Vercel account
- GitHub repository

#### Steps
1. **Push to GitHub**
```bash
git remote add origin https://github.com/yourusername/SNFT-marketplace.git
git push -u origin main
```

2. **Connect to Vercel**
- Visit https://vercel.com/new
- Import your GitHub repository
- Select `marketplace-frontend` as root directory

3. **Configure Build Settings**
```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

4. **Environment Variables**
Add the following environment variables in Vercel dashboard:
```env
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F
NEXT_PUBLIC_STACKS_API=https://api.mainnet.hiro.so
```

5. **Deploy**
Click "Deploy" and wait for build to complete.

6. **Custom Domain (Optional)**
- Go to Project Settings > Domains
- Add your custom domain
- Configure DNS records

### Option 2: Netlify

#### Steps
1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build Project**
```bash
cd marketplace-frontend
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod
```

4. **Environment Variables**
Add in Netlify dashboard:
```env
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F
NEXT_PUBLIC_STACKS_API=https://api.mainnet.hiro.so
```

### Option 3: Self-Hosted (VPS)

#### Prerequisites
- Ubuntu 20.04+ server
- Node.js 18+
- Nginx
- Domain name with DNS configured

#### Steps
1. **Connect to Server**
```bash
ssh user@your-server-ip
```

2. **Install Dependencies**
```bash
sudo apt update
sudo apt install nodejs npm nginx
```

3. **Clone Repository**
```bash
git clone https://github.com/yourusername/SNFT-marketplace.git
cd SNFT-marketplace/marketplace-frontend
```

4. **Install Packages**
```bash
npm install
```

5. **Build Application**
```bash
npm run build
```

6. **Configure PM2**
```bash
npm install -g pm2
pm2 start npm --name "snft-marketplace" -- start
pm2 save
pm2 startup
```

7. **Configure Nginx**
Create `/etc/nginx/sites-available/snft-marketplace`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. **Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/snft-marketplace /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

9. **SSL Certificate**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Post-Deployment Configuration

### Update Contract Addresses
1. Update `lib/contracts.ts` with deployed addresses:
```typescript
export const NFT_TOKEN = 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.nft-token';
export const MARKETPLACE = 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.marketplace';
export const ROYALTY_DISTRIBUTOR = 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.royalty-distributor';
```

2. Redeploy frontend with updated addresses.

### Initialize Platform Settings
Execute these contract calls via Stacks CLI or web interface:

1. **Set Platform Fee Recipient** (if needed)
```clarity
(contract-call? .marketplace set-platform-fee-recipient 'SP...)
```

2. **Set Platform Fee** (default is 2.5%, can adjust)
```clarity
(contract-call? .marketplace set-platform-fee u250)
```

### Configure Chainhooks (Optional)
For real-time blockchain monitoring:

1. **Create Chainhook Configuration**
```json
{
  "name": "nft-transfers",
  "version": 1,
  "networks": {
    "mainnet": {
      "if_this": {
        "scope": "contract_call",
        "contract_identifier": "SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.marketplace"
      },
      "then_that": {
        "http_post": {
          "url": "https://your-api.com/webhook",
          "authorization_header": "Bearer YOUR_TOKEN"
        }
      }
    }
  }
}
```

2. **Register Chainhook**
```bash
chainhooks register nft-transfers.json
```

---

## Monitoring and Maintenance

### Health Checks

#### Smart Contracts
Monitor contract calls and errors:
```bash
# Check contract status
curl https://api.mainnet.hiro.so/v2/contracts/interface/SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F/nft-token
```

#### Frontend
Set up uptime monitoring:
- Use services like UptimeRobot or Pingdom
- Monitor response times and availability
- Set up alerts for downtime

### Performance Optimization

#### Frontend
1. **Enable CDN** - Use Vercel Edge Network or Cloudflare
2. **Image Optimization** - Use Next.js Image component
3. **Code Splitting** - Lazy load components
4. **Caching** - Configure cache headers

#### API Calls
1. **Rate Limiting** - Implement request throttling
2. **Caching** - Cache contract read operations
3. **Batch Requests** - Combine multiple calls

### Security Audits

#### Regular Checks
1. **Dependency Updates**
```bash
npm audit
npm update
```

2. **Smart Contract Review**
- Monitor for suspicious transactions
- Review large transfers
- Check contract balance

3. **Frontend Security**
- HTTPS enforcement
- CSP headers
- XSS protection

### Backup and Recovery

#### Database (if using)
```bash
# Backup
pg_dump marketplace_db > backup.sql

# Restore
psql marketplace_db < backup.sql
```

#### Frontend Configuration
- Keep `.env` files backed up securely
- Document all custom configurations
- Version control all code changes

### Scaling Considerations

#### When to Scale
- Response time > 2 seconds
- Error rate > 1%
- Traffic increase > 100%

#### Scaling Options
1. **Vertical Scaling** - Upgrade server resources
2. **Horizontal Scaling** - Add more servers with load balancer
3. **CDN** - Distribute static assets globally
4. **Database** - Add read replicas

---

## Troubleshooting

### Common Issues

#### Contract Deployment Failed
```bash
# Check balance
stx-cli balance SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F

# Verify nonce
curl https://api.mainnet.hiro.so/v2/accounts/SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F
```

#### Frontend Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

#### Wallet Connection Issues
- Clear browser cache
- Update Hiro Wallet extension
- Check network selection (mainnet vs testnet)

### Support Resources
- **Stacks Discord**: https://discord.gg/stacks
- **Documentation**: https://docs.stacks.co
- **GitHub Issues**: https://github.com/yourusername/SNFT-marketplace/issues

---

## Deployment Checklist

Before going live, ensure:

- [ ] All smart contracts tested and verified
- [ ] Contracts deployed to mainnet
- [ ] Contract addresses updated in frontend
- [ ] Frontend built without errors
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Custom domain configured
- [ ] Monitoring tools set up
- [ ] Backup systems in place
- [ ] Documentation updated
- [ ] Team trained on operations
- [ ] Emergency contacts documented

---

**Deployment Date**: [Add Date]  
**Deployed By**: [Add Name]  
**Contract Version**: 1.0.0  
**Frontend Version**: 1.0.0
