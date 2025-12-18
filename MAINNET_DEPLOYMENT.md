# Mainnet Deployment Guide - NFT Marketplace

## ⚠️ CRITICAL: Pre-Deployment Checklist

### 1. Security Review
- [ ] **REPLACE MNEMONIC**: The current mnemonic in `settings/Mainnet.toml` is a TEST KEY
- [ ] Never commit real private keys to git
- [ ] Store production keys in secure environment variables
- [ ] Conduct security audit before mainnet deployment
- [ ] Review all contract code one final time

### 2. Account Preparation

**Deployer Address**: `SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F`

**Required STX Balance**: ~171 STX (170.49 STX + buffer)
- marketplace.clar: ~56.85 STX
- nft-token.clar: ~56.79 STX  
- royalty-distributor.clar: ~56.84 STX

**Steps:**
1. Fund deployer account with sufficient STX
2. Verify balance: https://explorer.hiro.so/address/SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F
3. Ensure funds are available before deployment

### 3. Update Production Configuration

**Replace test mnemonic in `settings/Mainnet.toml`:**

```toml
[accounts.deployer]
# DO NOT use the test mnemonic!
# Use your secure production mnemonic
mnemonic = "YOUR_SECURE_PRODUCTION_MNEMONIC_HERE"
```

## Deployment Process

### Step 1: Verify Contracts One Last Time

```bash
cd /home/henry/projects/SNFT-marketplace/nft-market-place

# Run all checks
clarinet check

# Run all tests
npm test
```

### Step 2: Review Deployment Plan

```bash
# View the generated deployment plan
cat deployments/default.mainnet-plan.yaml
```

The plan will deploy 3 contracts:
1. **marketplace.clar**
2. **nft-token.clar**
3. **royalty-distributor.clar**

### Step 3: Simulate Deployment (Recommended)

```bash
# Dry run to check for issues
clarinet deployment apply --mainnet --dry-run
```

### Step 4: Execute Mainnet Deployment

⚠️ **THIS WILL SPEND REAL STX - CANNOT BE UNDONE**

```bash
# Deploy to mainnet
clarinet deployment apply --mainnet

# Alternative: Use deployment plan file directly
clarinet deployment apply -p deployments/default.mainnet-plan.yaml
```

### Step 5: Verify Deployment

After deployment completes, verify contracts on Stacks Explorer:

1. **NFT Token Contract**:
   - https://explorer.hiro.so/txid/SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.nft-token

2. **Marketplace Contract**:
   - https://explorer.hiro.so/txid/SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.marketplace

3. **Royalty Distributor Contract**:
   - https://explorer.hiro.so/txid/SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.royalty-distributor

## Post-Deployment Tasks

### 1. Update Frontend Configuration

Update your frontend with mainnet contract addresses:

```javascript
const CONTRACTS = {
  nftToken: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.nft-token',
  marketplace: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.marketplace',
  royaltyDistributor: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.royalty-distributor'
};
```

### 2. Configure Chainhooks

Set up monitoring for contract events:

```yaml
# chainhooks.yaml
chainhooks:
  - name: nft-marketplace-events
    network: mainnet
    predicate:
      contract_identifier: "SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.marketplace"
      method: ["list-nft", "buy-nft", "make-offer", "accept-offer"]
```

### 3. Initialize Contracts

After deployment, you may want to:

```clarity
;; Set collection metadata (optional)
(contract-call? .nft-token set-collection-name "Your NFT Collection")
(contract-call? .nft-token set-base-uri "ipfs://")

;; Configure platform fee recipient (if different from deployer)
(contract-call? .marketplace set-platform-fee-recipient 'SP...)
(contract-call? .royalty-distributor set-platform-fee-recipient 'SP...)
```

### 4. Documentation Updates

Update IMPLEMENTATION_SUMMARY.md with deployed addresses:

```markdown
## Mainnet Contract Addresses

- **nft-token**: `SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.nft-token`
- **marketplace**: `SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.marketplace`
- **royalty-distributor**: `SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.royalty-distributor`
```

## Rollback Plan

If deployment fails or issues are discovered:

1. Contracts cannot be deleted once deployed
2. Deploy updated versions with new contract names (e.g., `nft-token-v2`)
3. Update frontend to point to new contracts
4. Migrate data if necessary

## Monitoring & Maintenance

### Health Checks

Monitor these metrics:
- Transaction success rate
- Gas costs
- Active listings
- Sales volume
- Royalty distributions

### Contract Interaction

Use Stacks CLI or web interface to:
- Monitor contract state
- Check listings and offers
- Verify royalty calculations
- Track platform fees

### API Integration

```javascript
// Using @stacks/blockchain-api-client
import { SmartContractsApi } from '@stacks/blockchain-api-client';

const api = new SmartContractsApi();

// Get contract source
const contract = await api.getContractById({
  contractId: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.marketplace'
});

// Read contract data
const listings = await api.callReadOnlyFunction({
  contractAddress: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F',
  contractName: 'marketplace',
  functionName: 'get-listing',
  functionArgs: ['0x0100000000000000000000000000000001'] // listing-id u1
});
```

## Cost Optimization

Deployment costs are based on:
- Contract size (lines of code)
- Clarity version
- Network congestion

To reduce costs:
- Deploy during low-traffic periods
- Use `--low-cost` flag (slower confirmation)
- Optimize contract code before deployment

## Support & Resources

- **Stacks Explorer**: https://explorer.hiro.so
- **Stacks Status**: https://status.hiro.so
- **API Docs**: https://docs.hiro.so/api
- **Discord**: https://discord.gg/stacks

## Emergency Contacts

If critical issues arise:
1. Pause marketplace: `(contract-call? .marketplace toggle-marketplace)`
2. Disable minting: `(contract-call? .nft-token toggle-minting)`
3. Monitor contract interactions via explorer
4. Contact security audit team if vulnerability found

---

## Quick Deploy Command

```bash
# After completing ALL checklist items:
cd /home/henry/projects/SNFT-marketplace/nft-market-place
clarinet deployment apply --mainnet
```

**Remember**: Mainnet deployment is irreversible. Triple-check everything!

---

**Deployment Date**: _To be completed_
**Deployed By**: _Your name_
**Network**: Stacks Mainnet
**Total Cost**: ~171 STX
