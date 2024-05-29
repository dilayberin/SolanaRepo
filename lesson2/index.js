import { 
    Keypair, // cüzdanı oluşturmak, yönetmek 
    Connection, // solana blockchaini ile bağlantı kurmak
    SystemProgram,  
    VersionedTransaction, 
    Message, 
    LAMPORTS_PER_SOL, 
    TransactionMessage 
} 
 
from "@solana/web3.js" 
 
// cüzdanın özel anahtarını tanımladık.(Uint8Array formatında) 
const privateKey = [ 
    170,  10,  89, 220, 111, 148,  20, 122,  19, 147, 155, 
     67, 239, 239, 234,   7,  96,  46,  41, 159,  21,  87, 
    234, 210,  92, 125,  28,  42, 183,   6, 143,  47, 166, 
    225, 170, 150, 142,  62, 211, 128,  77, 186, 192,  71, 
    154, 110,  59, 202, 176, 113,  81,  77,  94, 222,  27, 
    114, 110, 249, 153,   6,   7, 134, 126,  51 
  ] 
 
// solana devnet ağına bağlanmak için bir connection nesnesi oluşturduk.  
const connection =new Connection("https://api.devnet.solana.com","confirmed"); 
 
// Özel anahtardan bir keypair nesnesi oluşturur
const anahtar= Keypair.fromSecretKey(Uint8Array.from(privateKey)) 
 
 
// cüzdanın anah. ekrana yazdırır. 
// Genel anah. ait hesap bilgilerini solana devnet'ten alır. 
// hesapta bulunan lamports mik. yazar 
const deneme = async()=>{ 
    console.log(anahtar.publicKey.toString()) 
    const dene = await connection.getAccountInfo(anahtar.publicKey) 
    console.log(dene.lamports) 
 
} 

const proccess = async() => { 
    console.log("-------") 
    console.log("ana hesap: "+anahtar.publicKey.toString()) 
    console.log("-------") 
    const new_keypair = Keypair.generate() 
    const new_keypair2 = Keypair.generate() 
    console.log("oluşturulan 1. hesap: "+new_keypair.publicKey.toString()) 
    console.log("oluşturulan 2. hesap: "+new_keypair2.publicKey.toString()) 
 
  
    const ix = SystemProgram.createAccount({ 
        fromPubkey: anahtar.publicKey, //instraction ücreti ödeyecek hesap 
        newAccountPubkey: new_keypair.publicKey, // oluşturudğumuz hesap 
        lamports: LAMPORTS_PER_SOL*1, //transfer miktarı (oluştururken) 
        space: 0, //data tutmak için istiyorsak kiralıyoruz 
        programId: SystemProgram.programId //sisteme ait olduğunu gösteriyoruz, smart contracta aitse onunda bilgisini yazıyoruz 
    }) 
    const ix2 = SystemProgram.createAccount({ 
        fromPubkey: anahtar.publicKey, //instraction ücreti ödeyecek hesap 
        newAccountPubkey: new_keypair2.publicKey, // oluşturudğumuz hesap 
        lamports: LAMPORTS_PER_SOL*1, //transfer miktarı (oluştururken) 
        space: 0, //data tutmak için istiyorsak kiralıyoruz 
        programId: SystemProgram.programId //sisteme ait olduğunu gösteriyoruz, smart contracta aitse onunda bilgisini yazıyoruz 
    }) 
     
    const ix3 = SystemProgram.transfer({ 
        fromPubkey:new_keypair.publicKey, 
        toPubkey:new_keypair2.publicKey, 
        lamports:LAMPORTS_PER_SOL*0.5, 
    }) 
//ins. bir tanesi başarısız olursa tüm trans. başarısız olur 
    const message = new TransactionMessage({ 
        instructions: [ix,ix2,ix3],  
        payerKey: anahtar.publicKey,  
        recentBlockhash: (await connection.getLatestBlockhash()).blockhash 
    }).compileToV0Message() 
 
    
    const tx = new VersionedTransaction(message) 
     
 
    tx.sign([anahtar, new_keypair,new_keypair2])//hesabı ödeyenin ve oluşan hesabın imzalaması gerekiyor 
    
 
    const signature = await connection.sendTransaction(tx) 
     
 
    console.log(signature) 
    console.log(new_keypair2.publicKey.toString()) 
     
 
} 
 
proccess()
