import {
    Connection,//Solana blok zincirine bağlanma
    Keypair,//Solana blok zinciri üzerindeki işlemleri imzalamak için kullanılan bir çift anahtar
    PublicKey,//genel anahtar
    TransactionMessage,//Solana'daki bir işlemin içeriğini tanımlayan ve işlemin hangi hesaplar
          // ve talimatlarla ilişkili olduğunu belirten mesaj nesnesi
    VersionedTransaction,//bir sürümdeki işlemleri temsil eder
    SystemProgram,//Solana'daki yerleşik sistem programlarını (örneğin, hesap oluşturma) temsil eder
    TransactionInstruction,//Solana'daki bir işlemin gerçekleştirilmesi için gerekli olan talimatlar
    LAMPORTS_PER_SOL,//Solana'nın temel para birimi,lamport

  } from "@solana/web3.js";
  
    import { deserialize, serialize } from "borsh";

    
  class BizimAccount {
    sayi1:number = 0;
    sayi2:number = 0;
  
  
    constructor(fields: {sayi1:number;sayi2:number; } | undefined = undefined){
      if (fields) {
        this.sayi1 = fields.sayi1
        this.sayi2 = fields.sayi2
  
      }
    }
  
  }
  
  const BizimAccountSchema = new Map(
    [[BizimAccount,
    {
        kind: "struct",
        fields: [
          ["sayi1","u16"],//2  byte
          ["sayi2","u64"],//8 byte
        ]
      }
    ]
  ])

  
  class UserData {
    age:number = 0;
    score:number = 0;
    name:string="xxxxx";
  
  
    constructor(fields: {age:number;score:number;name:string } | undefined = undefined){
      if (fields) {
        this.age = fields.age
        this.score = fields.score
        this.name=fields.name
  
      }
    }
  
  }
  const UserDataSchema = new Map(
    [[UserData,
    {
        kind: "struct",
        fields: [
          ["age","u8"],//2  byte
          ["score","u16"],//8 byte
          ["name","String"]
          
        ]
      }
    ]
  ])
  

  
  //const connection= new Connection("https://api.testnet.solana.com","confirmed");
  const connection= new Connection("https://api.devnet.solana.com","confirmed");//devnetle bağlantı kuruyoruz.
  //const connection= new Connection("https://api.mainnet-beta.solana.com","confirmed");
  //const connection= new Connection("http://localhost:8899","confirmed");
  
  
  
  const privkey1 = 
  [153,187,227,210,27,108,215,173,44,244,156,74,194,28,155,122,71,217,19,208,234,242,206,140,90,56,195,207,
    73,113,207,157,220,189,39,249,130,185,164,194,196,55,144,15,84,36,233,49,66,177,100,45,220,200,
    12,207,135,110,74,254,221,39,178,75]
  
  const payer = Keypair.fromSecretKey(Uint8Array.from(privkey1));
  

const solana_template_program_id = new PublicKey("5ct5nM6DLgBJndvtMMq7oTUbmGAZm9Z6BsHvbchmusQV")
const toplama_hasabi = new PublicKey("9TVDEfw1M33Ysxx6KrndgMtUHgYqK498M1mEpsNq98E1")


const call = async () => {

  const new_acc = Keypair.generate()

  //console.log(new_acc.publicKey.toBase58())

  const toplama_datasi = new BizimAccount();

  toplama_datasi.sayi1 = 23;
  toplama_datasi.sayi2 = 2060;

  const encoded = serialize(BizimAccountSchema,toplama_datasi);
  

  const onune_bir_eklenmis = Uint8Array.of(1,...encoded);// 11 bytlik byte array

  const ix = new TransactionInstruction({
    keys:[
      {isSigner:true,isWritable:false,pubkey:payer.publicKey},
      {isSigner:false,isWritable:true,pubkey:toplama_hasabi},
    ],

    data:Buffer.from(onune_bir_eklenmis),

    programId:solana_template_program_id
  })


  const create_account = SystemProgram.createAccount({
    fromPubkey:payer.publicKey,
    newAccountPubkey:new_acc.publicKey,
    lamports:LAMPORTS_PER_SOL*0.01,
    space:10,
    programId:solana_template_program_id
    
  })


  const message = new TransactionMessage({
    instructions: [ix],
      payerKey: payer.publicKey,
      recentBlockhash : (await connection.getLatestBlockhash()).blockhash
    }).compileToV0Message();

    const tx = new VersionedTransaction(message);
    tx.sign([payer]);

    connection.sendTransaction(tx);


}

const read_data = async () => {

  const account_info = await connection.getAccountInfo(toplama_hasabi)

  const account_data = deserialize(BizimAccountSchema,BizimAccount,account_info?.data!);

  console.log("sayi1 = "+account_data.sayi1);
  console.log("sayi2 = "+account_data.sayi2);

}

const create_user = async () => {
  const kullaniciBilgisi=new UserData()
    kullaniciBilgisi.age=20
    kullaniciBilgisi.name="dilay"
    kullaniciBilgisi.score=100

  const encoded = serialize(UserDataSchema,kullaniciBilgisi);
  const eklenmis = Uint8Array.of(2,...encoded);


  
  const user_account=Keypair.generate()
  const new_account=Keypair.generate()

  const create_account = SystemProgram.createAccount({
    fromPubkey:payer.publicKey,
    newAccountPubkey:user_account.publicKey,
    lamports:LAMPORTS_PER_SOL*0.01,
    space:encoded.length,
    programId:solana_template_program_id
    
  })
  
  const create_account2 = SystemProgram.createAccount({
    fromPubkey:payer.publicKey,
    newAccountPubkey:new_account.publicKey,
    lamports:LAMPORTS_PER_SOL*0.01,
    space:10,
    programId:solana_template_program_id
    
  })

  const ix = new TransactionInstruction({
    keys:[
      {isSigner:true,isWritable:false,pubkey:payer.publicKey},
      {isSigner:false,isWritable:true,pubkey:new_account.publicKey},
      {isSigner:false,isWritable:true,pubkey:user_account.publicKey}
    ],

    data:Buffer.from(eklenmis),

    programId:solana_template_program_id
  })

   
  const message = new TransactionMessage({
    instructions: [create_account,create_account2,ix],
      payerKey: payer.publicKey,
      recentBlockhash : (await connection.getLatestBlockhash()).blockhash
    }).compileToV0Message();

    const tx = new VersionedTransaction(message);
    tx.sign([payer,new_account,user_account]);

    connection.sendTransaction(tx);
    console.log("hesap1:"+ user_account.publicKey.toString())
    console.log("hesap2:"+ new_account.publicKey.toString())



}


//call()
read_data()
create_user()