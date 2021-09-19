const { TezosToolkit, OpKind } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");

const Tezos = new TezosToolkit("https://mainnet.smartpy.io/");
const CONTRACT = "KT1B7o9UQArZGrfedHhYqG7VTWDTtkVop2X2";
const NUM_TO_MINT = 5; // amount to mint

(async function main() {
  Tezos.setProvider({
    signer: await InMemorySigner.fromSecretKey("your_private_key"),
  });
  const contract = await Tezos.wallet.at(CONTRACT);

  try {
    const transactions = [];
    for (let i = 0; i < NUM_TO_MINT; i++) {
      transactions.push({
        kind: OpKind.TRANSACTION,
        ...contract.methods
          .mint(1)
          .toTransferParams({ amount: 25000000, fee: 50000, mutez: true }),
      });
    }
    let batch = Tezos.wallet.batch(transactions);
    const op = await batch.send();
    console.log("Confirming...");
    await op.confirmation(2);
    console.log(op.opHash);
  } catch (err) {
    console.log(err);
  }
})();
