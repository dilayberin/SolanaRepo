use solana_program::{entrypoint::ProgramResult,entrypoint, pubkey::Pubkey , account_info::{next_account_info, AccountInfo}};
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize,BorshDeserialize)]
pub struct Sayac { pub adet:u16 } 

entrypoint!(process_instruction);
pub fn process_instruction( _program_id : &Pubkey , accounts : &[AccountInfo] , instruction_data : &[u8]) -> ProgramResult{

    let accounts_iter: &mut std::slice::Iter<'_, AccountInfo<'_>> = &mut accounts.iter();

    let write_data_acc: &AccountInfo<'_> = next_account_info(accounts_iter)?;//kaç acc varsa sırayla tanımlanır

    let mut sayac: Sayac=Sayac :: try_from_slice(&write_data_acc.data.borrow())?;//datayı okuduk.

    let kullanicinin_parametresi : Sayac=Sayac ::try_from_slice(instruction_data)?;

    if sayac.adet < kullanicinin_parametresi.adet {
        sayac.adet+=1;
    }  
    else {
        sayac.adet+=5;
    }

    sayac.serialize(&mut &mut write_data_acc.data.borrow_mut()[..])?;







    





    Ok(())
}

