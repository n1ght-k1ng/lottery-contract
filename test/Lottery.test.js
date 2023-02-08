const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider()); // ganache is a local test network

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    // test 1 - the address of the person who entered the lottery should be stored in the players array
    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        })
    const players = await lottery.methods.getPlayers().call({
        from: accounts[0]
    })
    assert.equal(accounts[0], players[0]);
    assert.equal(1,players.length)
})
it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.02', 'ether')
    })
    await lottery.methods.enter().send({
        from: accounts[1],
        value: web3.utils.toWei('0.02', 'ether')
    })
    await lottery.methods.enter().send({
        from: accounts[2],
        value: web3.utils.toWei('0.02', 'ether')
    })
const players = await lottery.methods.getPlayers().call({
    from: accounts[0]
})
assert.equal(accounts[0], players[0]);
assert.equal(accounts[1], players[1]);
assert.equal(accounts[2], players[2]);
assert.equal(3,players.length)
})
it('requires a minimum amount of ether to enter', async() =>{
    try{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: 200,
    })
    assert(false)
} // if something goes wrong in the try block , the catch block will be executed
    catch(err){
        assert(err) // if the error is not null then the test will pass
    }
})
    // while using async await code we need to use try catch block to test our block

    it('only manager can call pickWinner', async() =>{
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            })
            assert(false)
        }
        catch(err){{
            assert(err)
        }
    }})
    it('sends money to the winner and resets the players array', async() =>{
        await Lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2','ether')
    })
    const initialBalance = await web3.eth.getBalance(accounts[0])
    await lottery.methods.pickWinner().send({from: accounts[0]}) 
    const finalBalance = await web3.eth.getBalance(accounts[0])
    const difference = finalBalance - initialBalance
    assert(difference > web3.util.toWei('1.8','ether'))
}) // assertion of contract being emptied out after the winner is picked can be done

})
