import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "NFT Token: Can mint NFT with metadata and royalty",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'mint',
                [
                    types.principal(wallet1.address),
                    types.ascii("ipfs://QmTest123"),
                    types.uint(500) // 5% royalty
                ],
                deployer.address
            )
        ]);
        
        block.receipts[0].result.expectOk().expectUint(1);
        
        // Verify ownership
        let ownerBlock = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'get-owner',
                [types.uint(1)],
                deployer.address
            )
        ]);
        
        ownerBlock.receipts[0].result.expectOk().expectSome().expectPrincipal(wallet1.address);
    },
});

Clarinet.test({
    name: "NFT Token: Can transfer NFT between accounts",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        // Mint NFT
        let block = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'mint',
                [
                    types.principal(wallet1.address),
                    types.ascii("ipfs://QmTest123"),
                    types.uint(500)
                ],
                deployer.address
            )
        ]);
        
        block.receipts[0].result.expectOk().expectUint(1);
        
        // Transfer NFT
        let transferBlock = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'transfer',
                [
                    types.uint(1),
                    types.principal(wallet1.address),
                    types.principal(wallet2.address)
                ],
                wallet1.address
            )
        ]);
        
        transferBlock.receipts[0].result.expectOk().expectBool(true);
        
        // Verify new owner
        let ownerBlock = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'get-owner',
                [types.uint(1)],
                deployer.address
            )
        ]);
        
        ownerBlock.receipts[0].result.expectOk().expectSome().expectPrincipal(wallet2.address);
    },
});

Clarinet.test({
    name: "NFT Token: Cannot mint with invalid royalty percentage",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'mint',
                [
                    types.principal(wallet1.address),
                    types.ascii("ipfs://QmTest123"),
                    types.uint(1500) // 15% - too high
                ],
                deployer.address
            )
        ]);
        
        block.receipts[0].result.expectErr().expectUint(104); // err-invalid-royalty
    },
});

Clarinet.test({
    name: "NFT Token: Can approve and transfer via approved spender",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        const wallet3 = accounts.get('wallet_3')!;
        
        // Mint NFT
        let block = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'mint',
                [
                    types.principal(wallet1.address),
                    types.ascii("ipfs://QmTest123"),
                    types.uint(500)
                ],
                deployer.address
            )
        ]);
        
        // Approve wallet2 to transfer
        let approveBlock = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'approve',
                [
                    types.uint(1),
                    types.principal(wallet2.address)
                ],
                wallet1.address
            )
        ]);
        
        approveBlock.receipts[0].result.expectOk().expectBool(true);
        
        // wallet2 transfers to wallet3
        let transferBlock = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'transfer',
                [
                    types.uint(1),
                    types.principal(wallet1.address),
                    types.principal(wallet3.address)
                ],
                wallet2.address
            )
        ]);
        
        transferBlock.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "NFT Token: Can burn owned NFT",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Mint NFT
        let block = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'mint',
                [
                    types.principal(wallet1.address),
                    types.ascii("ipfs://QmTest123"),
                    types.uint(500)
                ],
                deployer.address
            )
        ]);
        
        // Burn NFT
        let burnBlock = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'burn',
                [types.uint(1)],
                wallet1.address
            )
        ]);
        
        burnBlock.receipts[0].result.expectOk().expectBool(true);
        
        // Verify NFT no longer has owner
        let ownerBlock = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'get-owner',
                [types.uint(1)],
                deployer.address
            )
        ]);
        
        ownerBlock.receipts[0].result.expectOk().expectNone();
    },
});

Clarinet.test({
    name: "NFT Token: Can set and retrieve metadata",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Mint NFT
        let block = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'mint',
                [
                    types.principal(wallet1.address),
                    types.ascii("ipfs://QmTest123"),
                    types.uint(750) // 7.5% royalty
                ],
                deployer.address
            )
        ]);
        
        // Get metadata
        let metadataBlock = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'get-token-metadata',
                [types.uint(1)],
                deployer.address
            )
        ]);
        
        const metadata = metadataBlock.receipts[0].result.expectOk().expectSome();
        
        // Get royalty
        let royaltyBlock = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'get-token-royalty',
                [types.uint(1)],
                deployer.address
            )
        ]);
        
        royaltyBlock.receipts[0].result.expectOk().expectUint(750);
    },
});

Clarinet.test({
    name: "NFT Token: Can toggle minting",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Toggle minting off
        let toggleBlock = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'toggle-minting',
                [],
                deployer.address
            )
        ]);
        
        toggleBlock.receipts[0].result.expectOk().expectBool(false);
        
        // Try to mint (should fail)
        let mintBlock = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'mint',
                [
                    types.principal(wallet1.address),
                    types.ascii("ipfs://QmTest123"),
                    types.uint(500)
                ],
                deployer.address
            )
        ]);
        
        mintBlock.receipts[0].result.expectErr().expectUint(105); // err-unauthorized
    },
});

Clarinet.test({
    name: "NFT Token: Non-owner cannot transfer NFT",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        const wallet3 = accounts.get('wallet_3')!;
        
        // Mint NFT
        let block = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'mint',
                [
                    types.principal(wallet1.address),
                    types.ascii("ipfs://QmTest123"),
                    types.uint(500)
                ],
                deployer.address
            )
        ]);
        
        // wallet2 tries to transfer (should fail)
        let transferBlock = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'transfer',
                [
                    types.uint(1),
                    types.principal(wallet1.address),
                    types.principal(wallet3.address)
                ],
                wallet2.address
            )
        ]);
        
        transferBlock.receipts[0].result.expectErr().expectUint(101); // err-not-token-owner
    },
});
