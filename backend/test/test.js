var server = require('../server');
const donationProgress = require('../services/donationProgress');
const BankItem = require('../models/BankItem');
const DonationRequest = require('../models/DonationRequest');

describe('roundup service', function() {
    it('should calculate roundup per given bankItem', async () => {
        /* 


        const bankItem = await BankItem.findOne({"itemId": 'mzbB9RrJoECzm6DVPDlVuGkdq8wNRDhg4rbv5'});
        await donationProgress.triggerCalculateDonationProgressByBankItem(bankItem);
        */
    });
    it('should calculate roundup per given donationRequest', async () =>{
        /* 

        const donationRequest = await DonationRequest.findById('5fbe299337808849e837c38d');
        const donationPrgressResult = await donationProgress.triggerDonationProgressCalculaton(donationRequest);
        console.log(donationPrgressResult);
        */
    });
});
