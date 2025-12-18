import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Royalty Distributor: Can calculate royalty correctly",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'calculate-royalty',
                [
                    types.uint(1000000), // 1 STX
                    types.uint(500)      // 5% royalty
                ],
                deployer.address
            )
        ]);
        
        // 5% of 1,000,000 = 50,000
        block.receipts[0].result.expectOk().expectUint(50000);
    },
});

Clarinet.test({
    name: "Royalty Distributor: Can calculate platform fee correctly",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'calculate-platform-fee',
                [types.uint(1000000)], // 1 STX
                deployer.address
            )
        ]);
        
        // 2.5% of 1,000,000 = 25,000
        block.receipts[0].result.expectOk().expectUint(25000);
    },
});

Clarinet.test({
    name: "Royalty Distributor: Can calculate full distribution",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'calculate-distribution',
                [
                    types.uint(1000000), // 1 STX sale
                    types.uint(500)      // 5% royalty
                ],
                deployer.address
            )
        ]);
        
        const result = block.receipts[0].result.expectOk().expectTuple();
        // Platform fee: 25,000 (2.5%)
        // Royalty: 50,000 (5%)
        // Seller: 925,000 (92.5%)
        // Total: 1,000,000
    },
});

Clarinet.test({
    name: "Royalty Distributor: Cannot set royalty above maximum",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'set-token-royalty',
                [
                    types.principal(deployer.address),
                    types.uint(1),
                    types.principal(wallet1.address),
                    types.uint(1500) // 15% - too high
                ],
                deployer.address
            )
        ]);
        
        block.receipts[0].result.expectErr().expectUint(301); // err-invalid-royalty
    },
});

Clarinet.test({
    name: "Royalty Distributor: Can set and retrieve token royalty",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Set token royalty
        let block = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'set-token-royalty',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1),
                    types.principal(wallet1.address),
                    types.uint(750) // 7.5%
                ],
                deployer.address
            )
        ]);
        
        block.receipts[0].result.expectOk().expectBool(true);
        
        // Retrieve royalty
        let getRoyaltyBlock = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'get-token-royalty',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1)
                ],
                deployer.address
            )
        ]);
        
        const royalty = getRoyaltyBlock.receipts[0].result.expectOk().expectSome().expectTuple();
    },
});

Clarinet.test({
    name: "Royalty Distributor: Can set collection default royalty",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'set-collection-default-royalty',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.principal(wallet1.address),
                    types.uint(500) // 5%
                ],
                deployer.address
            )
        ]);
        
        block.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Royalty Distributor: Can distribute payment with royalties",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const seller = accounts.get('wallet_1')!;
        const buyer = accounts.get('wallet_2')!;
        const creator = accounts.get('wallet_3')!;
        
        // Set token royalty first
        let setupBlock = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'set-token-royalty',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1),
                    types.principal(creator.address),
                    types.uint(500) // 5%
                ],
                deployer.address
            )
        ]);
        
        // Distribute payment
        let block = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'distribute-payment',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1),
                    types.uint(1000000), // 1 STX
                    types.principal(seller.address),
                    types.principal(buyer.address)
                ],
                buyer.address
            )
        ]);
        
        const result = block.receipts[0].result.expectOk().expectTuple();
    },
});

Clarinet.test({
    name: "Royalty Distributor: Can distribute simple payment",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const seller = accounts.get('wallet_1')!;
        const buyer = accounts.get('wallet_2')!;
        const creator = accounts.get('wallet_3')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'distribute-payment-simple',
                [
                    types.uint(1000000), // 1 STX
                    types.principal(seller.address),
                    types.principal(creator.address),
                    types.uint(500) // 5%
                ],
                buyer.address
            )
        ]);
        
        const result = block.receipts[0].result.expectOk().expectTuple();
    },
});

Clarinet.test({
    name: "Royalty Distributor: Can update platform fee",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'set-platform-fee',
                [types.uint(300)], // 3%
                deployer.address
            )
        ]);
        
        block.receipts[0].result.expectOk().expectBool(true);
        
        // Verify new fee
        let feeBlock = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'calculate-platform-fee',
                [types.uint(1000000)],
                deployer.address
            )
        ]);
        
        // 3% of 1,000,000 = 30,000
        feeBlock.receipts[0].result.expectOk().expectUint(30000);
    },
});

Clarinet.test({
    name: "Royalty Distributor: Can toggle royalty system",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'toggle-royalty-system',
                [],
                deployer.address
            )
        ]);
        
        block.receipts[0].result.expectOk().expectBool(false);
    },
});

Clarinet.test({
    name: "Royalty Distributor: Non-owner cannot set collection royalty",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'set-collection-default-royalty',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.principal(wallet1.address),
                    types.uint(500)
                ],
                wallet1.address // Not the owner
            )
        ]);
        
        block.receipts[0].result.expectErr().expectUint(300); // err-owner-only
    },
});

Clarinet.test({
    name: "Royalty Distributor: Can track and retrieve creator earnings",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const creator = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'get-creator-earnings',
                [types.principal(creator.address)],
                deployer.address
            )
        ]);
        
        block.receipts[0].result.expectOk().expectUint(0);
    },
});

Clarinet.test({
    name: "Royalty Distributor: Can get platform fee info",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'royalty-distributor',
                'get-platform-fee-info',
                [],
                deployer.address
            )
        ]);
        
        const info = block.receipts[0].result.expectOk().expectTuple();
    },
});
