module my_token::my_token {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::managed_coin;

    struct MyToken has store, copy, drop {}

    const NAME: vector<u8> = b"MyToken";
    const SYMBOL: vector<u8> = b"MYT";
    const DECIMALS: u8 = 6;

    public entry fun initialize(account: &signer) {
        managed_coin::initialize<MyToken>(
            account,
            NAME,
            SYMBOL,
            DECIMALS,
            true
        );
        coin::register<MyToken>(account);
    }

    public entry fun mint(account: &signer, recipient: address, amount: u64) {
        managed_coin::mint<MyToken>(account, recipient, amount);
    }

    public entry fun transfer(account: &signer, recipient: address, amount: u64) {
        coin::transfer<MyToken>(account, recipient, amount);
    }
}
