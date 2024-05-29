use crate::{error::RNGProgramError::InvalidInstruction, state::{Toplama,UserData} };
use borsh::BorshDeserialize;
use solana_program::program_error::ProgramError;

#[derive(Debug, PartialEq)]
pub enum RNGProgramInstruction {
  CallProgram,
  WriteData{data:Toplama},
  CreateUser{kullanici_bilgisi:UserData}
  

}

impl RNGProgramInstruction {
  pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {

    let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;
    Ok(match tag {
      0 => Self::CallProgram,
      1 => Self::WriteData{
        data:Toplama::try_from_slice(&rest)?
      },
      2 => Self::CreateUser{
        kullanici_bilgisi:UserData::try_from_slice(&rest)?
      },




      _ => return Err(InvalidInstruction.into()),
    })
  }
}

