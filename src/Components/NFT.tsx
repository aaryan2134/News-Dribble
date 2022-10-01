import { useState, useEffect } from 'react'
import React from 'react'
import { useLocation } from 'react-router-dom'
import Deso from 'deso-protocol'
import NavBar from './Navbar'
import Spinner from './Spinner'
const deso = new Deso()
function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}
export default function MintPage() {
    const [imageSource, setImageSource] = useState('')
    const [imageCaption, setImageCaption] = useState('')
    const [loggedInUser, setLoggedInUser] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [wasInitialized, setWasInitialized] = useState(false)
    const [isMinting, setIsMinting] = useState(false)
    const [mintedPostHashHex, setMintedPostHashHex] = useState('')
    const [isMinted, setIsMinted] = useState(false)
    const query = useQuery()
    console.log(query)
    let imgURL: any = query.get("imgURL")
    let caption: any = query.get('caption')
    console.log(`imgURL: ${imgURL} and caption: ${caption}`)
    useEffect(() => {
        if (imgURL || caption) {
            setImageCaption(caption ? caption : "")
            setImageSource(imgURL)
            console.log("yup just updateddd")
        }

    }, [imgURL.caption])

    const initUserStuff = async () => {
        const loggedInPubicKey: any = localStorage.getItem('loggedInKey')
        setLoggedInUser(loggedInPubicKey)
        console.log("Yup checked!!!")
        setWasInitialized(true)
    }
    const handleMint = async () => {
        try {


            if (isMinting) {
                return
            }
           
            setIsMinting(true)
            const loggedInPubicKey: any = localStorage.getItem('loggedInKey')


            const request4 = {
                "UpdaterPublicKeyBase58Check": loggedInPubicKey,
                "BodyObj": {
                    "Body": `I have just placed my bet for Memphis Grizzlies @ 1 DESO\n `,
                    "VideoURLs": [],
                    "ImageURLs": [imageSource]
                }
            };
            const response3 = await deso.posts.submitPost(request4);
            console.log(response3)
            const madePostHashHex: any = response3.submittedTransactionResponse.PostEntryResponse.PostHashHex
            setMintedPostHashHex(madePostHashHex)

            const request5 = {
                "UpdaterPublicKeyBase58Check": loggedInPubicKey,
                "NFTPostHashHex": madePostHashHex,
                "NumCopies": 1,
                "NFTRoyaltyToCreatorBasisPoints": 100,
                "NFTRoyaltyToCoinBasisPoints": 100,
                "HasUnlockable": false,
                "IsForSale": true,
                "MinFeeRateNanosPerKB": 1000
            };
            const response4 = await deso.nft.createNft(request5);

            setIsMinting(false)
            setIsMinted(true)

        } catch (e) {
            alert(`Something Went Wrong! Make sure you have enough gas fees\nError:${e}`)
        }


    }
    useEffect(() => {


        initUserStuff()

    }, []);


    const handleDesoLogin = async () => {
        const loginType: any = 4
        const response2: any = await deso.identity.login(loginType);
        if (response2.key) {
            localStorage.setItem("loggedInKey", response2.key);
            setLoggedInUser(response2.key);


        }
    };

    return (
        <div>
            <NavBar />
            <div className='pt-20'>
                {/* <button onClick={handleDesoLogin} >Login with deso</button> */}
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex items-baseline space-x-2 justify-center my-4 flex-wrap'>
                        <p className='text-lg font-semibold'                     
                            style={{
                                color: 'white'
                            }}>
                      Amount(in DESO):</p>
                        <input
                            value={imageCaption}
                            onChange={(e) => setImageCaption(e.target.value)}
                            className='w-96 h-10 px-4 py-2 mb-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500'
                        ></input>

                        <p className='text-lg font-semibold'                     
                            style={{
                                color: 'white'
                            }}>
                      Team:</p>
                        <select name="language" id="language" className='text-lg font-semibold'>
                          <option value="team1" className='text-lg font-semibold'>Memphis Grizzlies</option>
                          <option value="team2" className='text-lg font-semibold'>Milwaukee Bucks</option>
                        </select>
                      
                    </div>
                    {/* <img src={imageSource} alt='nft' className='w-50 h-auto shadow-lg rounded-md  ' 
                    
                    style={{

                        maxWidth: '500px',
                    }}
                        /> */}
                    <button className='my-6 px-6 py-3 bg-gray-900 hover:bg-gray-800 rounded-md shadown-md text-white'

                        onClick={
                            () => {
                                if(!imageCaption){
                                    alert("Please enter a valid amount")
                                    return
                                }

                                setShowModal(true)
                            }
                        }>Place Your Bet</button>
                </div>
            </div>
            {showModal ? (
                <>
                    <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
                        <div className='relative w-auto my-6 mx-auto max-w-3xl'>
                            {/*content*/}
                            <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                                {/*header*/}
                                <div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
                                    <h3 className='text-3xl font-semibold'>
                                        {!loggedInUser && 'Login with Deso required'}
                                        {loggedInUser && !isMinted && 'Confirm your bet'}
                                        {isMinted && 'Minted!'}
                                    </h3>
                                    <button
                                        className='p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                                        onClick={() => setShowModal(false)}>
                                        <span className='bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none'>
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className='relative p-6 flex-auto'>

                                    <p className='overflow-clip'>
                                        {!loggedInUser && !isMinted && 'You need to Login with Deso Identity to finalise your bet!'}
                                        {loggedInUser && !isMinted && 'Your are about to place your Bet with Deso Address:'}
                                        {loggedInUser && !isMinted && <span className='text-sm px-2 py-1 bg-gray-200 rounded-lg'>{loggedInUser}</span>}

                                        {isMinted && 'Your Bet has been placed!'}
                                    </p>
                                    <div className="flex justify-center my-7 flex-col items-center">
                                        {loggedInUser && <h1>{`Amount(in DESO): ${imageCaption}`}</h1>}
                                        {loggedInUser && <h1>{`Team Selected: Memphis Grizzlies`}</h1>}
                                        {loggedInUser && <img src={imgURL} className=' rounded-xl shadow-xl my-3'

                                            style={{

                                                maxWidth: '300px',
                                            }}></img>}
                                    </div>
                                    <div className='flex justify-center mt-7'>

                                        {!loggedInUser &&
                                            <button className='px-6 py-3 bg-gray-900 hover:bg-gray-800 rounded-md shadown-md text-white'
                                                onClick={handleDesoLogin}
                                            >Login with Deso</button>}

                                        {loggedInUser && !isMinted && <button className='px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md shadown-md text-white'
                                            onClick={handleMint}
                                        >{!isMinting ? `Confirm!` : "Placing..."}</button>}
                                        {isMinted && <a className='text-blue-500 underline '
                                            href={`https://node.deso.org/posts/${mintedPostHashHex}`}
                                            target="_blank">Check out your Bet on DeSo Social Media</a>}

                                    </div>
                                    {isMinting && <div className=' flex justify-center '>
                                        <Spinner />
                                    </div>}





                                </div>
                                {/*footer*/}
                                <div className='flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b  '>
                                    {loggedInUser && !isMinting && <button className='text-red-500 underline font-bold text-sm'
                                        onClick={
                                            () => {
                                                localStorage.removeItem('loggedInKey')
                                                setLoggedInUser(null)
                                            }
                                        }
                                    >Logout</button>}
                                    {!isMinting &&
                                        <button
                                            className='text-red-500 background-transparent font-bold uppercase px-6 text-sm outline-none focus:outline-none  ease-linear transition-all duration-150'
                                            type='button'
                                            onClick={() => setShowModal(false)}>
                                            Close
                                        </button>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
                </>
            ) : null}
        </div>
    )
}


