import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

// Helper function to mint an NFT for testing
function mintNFT(chain: Chain, deployer: Account, recipient: Account, tokenId: number = 1) {
    return chain.mineBlock([
        Tx.contractCall(
            'nft-token',
            'mint',
            [
                types.principal(recipient.address),
                types.ascii(`ipfs://QmTest${tokenId}`),
                types.uint(500) // 5% royalty
            ],
            deployer.address
        )
    ]);
}

Clarinet.test({
    name: "Marketplace: Can list NFT for sale",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const seller = accounts.get('wallet_1')!;
        
        // First mint an NFT
        mintNFT(chain, deployer, seller, 1);
        
        // Approve marketplace to transfer
        let approveBlock = chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'approve',
                [
                    types.uint(1),
                    types.principal(deployer.address + '.marketplace')
                ],
                seller.address
            )
        ]);
        
        // List NFT
        let block = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'list-nft',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1),
                    types.uint(1000000), // 1 STX
                    types.uint(1000)     // expires at block 1000
                ],
                seller.address
            )
        ]);
        
        block.receipts[0].result.expectOk().expectUint(1); // listing ID
    },
});

Clarinet.test({
    name: "Marketplace: Cannot list with invalid price",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const seller = accounts.get('wallet_1')!;
        
        mintNFT(chain, deployer, seller, 1);
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'list-nft',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1),
                    types.uint(0), // Invalid price
                    types.uint(1000)
                ],
                seller.address
            )
        ]);
        
        block.receipts[0].result.expectErr().expectUint(207); // err-invalid-price
    },
});

Clarinet.test({
    name: "Marketplace: Non-owner cannot list NFT",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const seller = accounts.get('wallet_1')!;
        const nonOwner = accounts.get('wallet_2')!;
        
        mintNFT(chain, deployer, seller, 1);
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'list-nft',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1),
                    types.uint(1000000),
                    types.uint(1000)
                ],
                nonOwner.address // Not the owner
            )
        ]);
        
        block.receipts[0].result.expectErr().expectUint(201); // err-not-token-owner
    },
});

Clarinet.test({
    name: "Marketplace: Can unlist NFT",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const seller = accounts.get('wallet_1')!;
        
        mintNFT(chain, deployer, seller, 1);
        
        // Approve and list
        chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'approve',
                [
                    types.uint(1),
                    types.principal(deployer.address + '.marketplace')
                ],
                seller.address
            )
        ]);
        
        let listBlock = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'list-nft',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1),
                    types.uint(1000000),
                    types.uint(1000)
                ],
                seller.address
            )
        ]);
        
        // Unlist
        let unlistBlock = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'unlist-nft',
                [types.uint(1)], // listing ID
                seller.address
            )
        ]);
        
        unlistBlock.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Marketplace: Can retrieve listing details",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const seller = accounts.get('wallet_1')!;
        
        mintNFT(chain, deployer, seller, 1);
        
        chain.mineBlock([
            Tx.contractCall(
                'nft-token',
                'approve',
                [
                    types.uint(1),
                    types.principal(deployer.address + '.marketplace')
                ],
                seller.address
            )
        ]);
        
        chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'list-nft',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1),
                    types.uint(1000000),
                    types.uint(1000)
                ],
                seller.address
            )
        ]);
        
        // Get listing
        let block = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'get-listing',
                [types.uint(1)],
                deployer.address
            )
        ]);
        
        const listing = block.receipts[0].result.expectOk().expectSome().expectTuple();
    },
});

Clarinet.test({
    name: "Marketplace: Can calculate platform fee",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
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
    name: "Marketplace: Can make offer on NFT",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const seller = accounts.get('wallet_1')!;
        const buyer = accounts.get('wallet_2')!;
        
        mintNFT(chain, deployer, seller, 1);
        
        // Make offer
        let block = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'make-offer',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1),
                    types.uint(800000), // 0.8 STX offer
                    types.uint(1000)    // expires at block 1000
                ],
                buyer.address
            )
        ]);
        
        block.receipts[0].result.expectOk().expectUint(1); // offer ID
    },
});

Clarinet.test({
    name: "Marketplace: Cannot make offer with zero amount",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const seller = accounts.get('wallet_1')!;
        const buyer = accounts.get('wallet_2')!;
        
        mintNFT(chain, deployer, seller, 1);
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'make-offer',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1),
                    types.uint(0), // Invalid amount
                    types.uint(1000)
                ],
                buyer.address
            )
        ]);
        
        block.receipts[0].result.expectErr().expectUint(210); // err-invalid-offer
    },
});

Clarinet.test({
    name: "Marketplace: Can cancel own offer",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const seller = accounts.get('wallet_1')!;
        const buyer = accounts.get('wallet_2')!;
        
        mintNFT(chain, deployer, seller, 1);
        
        // Make offer
        chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'make-offer',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1),
                    types.uint(800000),
                    types.uint(1000)
                ],
                buyer.address
            )
        ]);
        
        // Cancel offer
        let block = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'cancel-offer',
                [types.uint(1)], // offer ID
                buyer.address
            )
        ]);
        
        block.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Marketplace: Non-offerer cannot cancel offer",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const seller = accounts.get('wallet_1')!;
        const buyer = accounts.get('wallet_2')!;
        const other = accounts.get('wallet_3')!;
        
        mintNFT(chain, deployer, seller, 1);
        
        // Make offer
        chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'make-offer',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1),
                    types.uint(800000),
                    types.uint(1000)
                ],
                buyer.address
            )
        ]);
        
        // Try to cancel from different account
        let block = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'cancel-offer',
                [types.uint(1)],
                other.address // Not the offerer
            )
        ]);
        
        block.receipts[0].result.expectErr().expectUint(206); // err-unauthorized
    },
});

Clarinet.test({
    name: "Marketplace: Can retrieve offer details",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const seller = accounts.get('wallet_1')!;
        const buyer = accounts.get('wallet_2')!;
        
        mintNFT(chain, deployer, seller, 1);
        
        chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'make-offer',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1),
                    types.uint(800000),
                    types.uint(1000)
                ],
                buyer.address
            )
        ]);
        
        // Get offer
        let block = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'get-offer',
                [types.uint(1)],
                deployer.address
            )
        ]);
        
        const offer = block.receipts[0].result.expectOk().expectSome().expectTuple();
    },
});

Clarinet.test({
    name: "Marketplace: Can toggle marketplace on/off",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'toggle-marketplace',
                [],
                deployer.address
            )
        ]);
        
        block.receipts[0].result.expectOk().expectBool(false);
    },
});

Clarinet.test({
    name: "Marketplace: Non-owner cannot toggle marketplace",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'toggle-marketplace',
                [],
                wallet1.address // Not the owner
            )
        ]);
        
        block.receipts[0].result.expectErr().expectUint(200); // err-owner-only
    },
});

Clarinet.test({
    name: "Marketplace: Can update platform fee recipient",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const newRecipient = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'set-platform-fee-recipient',
                [types.principal(newRecipient.address)],
                deployer.address
            )
        ]);
        
        block.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Marketplace: Can get token offers list",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const seller = accounts.get('wallet_1')!;
        const buyer = accounts.get('wallet_2')!;
        
        mintNFT(chain, deployer, seller, 1);
        
        // Make offer
        chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'make-offer',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1),
                    types.uint(800000),
                    types.uint(1000)
                ],
                buyer.address
            )
        ]);
        
        // Get token offers
        let block = chain.mineBlock([
            Tx.contractCall(
                'marketplace',
                'get-token-offers',
                [
                    types.principal(deployer.address + '.nft-token'),
                    types.uint(1)
                ],
                deployer.address
            )
        ]);
        
        const offers = block.receipts[0].result.expectOk().expectList();
    },
});
