use crate::error::MailError::NotWritable;
use crate::instruction::MailInstruction;
use crate::state::{DataLength, Mail, MailAccount};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
  account_info::AccountInfo, borsh::get_instance_packed_len, entrypoint::ProgramResult, msg,
  program_error::ProgramError, pubkey::Pubkey,
};
use std::convert::TryFrom;

pub struct Processor;
impl Processor {
  pub fn process(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
  ) -> ProgramResult {
    let instruction = MailInstruction::unpack(instruction_data)?;

    match instruction {
      MailInstruction::InitAccount => {
        msg!("Instruction: InitAccount");
        Self::process_init_account(&accounts[0], program_id)
      }
      MailInstruction::SendMail { mail } => {
        msg!("Instruction: SendMail");
        Self::process_send_mail(accounts, &mail, program_id)
      }
    }
  }

  fn process_init_account(account: &AccountInfo, program_id: &Pubkey) -> ProgramResult {
   

    Ok(())
  }

  fn process_send_mail(
    accounts: &[AccountInfo],
    mail: &Mail,
    program_id: &Pubkey,
  ) -> ProgramResult {
   
    Ok(())
  }
}


