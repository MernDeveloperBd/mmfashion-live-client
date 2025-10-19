import { useEffect, useState } from 'react';
import { FaRegSmile } from "react-icons/fa";
import { FaList } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast'
import io from 'socket.io-client'
import { add_friend, send_message, updateMessage, messageClear } from '../../store/Reducers/chatReducer';
import { AiOutlineMessage, AiOutlinePlus } from 'react-icons/ai'
import { useRef } from 'react';
import userImage from '../../assets/seller.png'
import { base_url } from '../../utils/config';
const socket = io(base_url)

const FALLBACK_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png?text=User';

const Chat = () => {
    const scrollRef = useRef()
    const bottomRef = useRef(null);
    const listRef = useRef(null);
    const dispatch = useDispatch()
    const { sellerId } = useParams()
    const [show, setShow] = useState(false)
    const [receverMessage, setReceverMessage] = useState('')
    const [activeSeller, setActiveSeller] = useState([])
    const [text, setText] = useState('')
    const { userInfo } = useSelector(state => state.auth)
    const { fd_messages, currentFd, my_friends, successMessage } = useSelector(state => state.chat)

    useEffect(() => {
        socket.emit('add_user', userInfo.id, userInfo)
    }, [userInfo])

    useEffect(() => {
        dispatch(add_friend({
            sellerId: sellerId || "",
            userId: userInfo.id
        }))
    }, [dispatch, userInfo, sellerId])

    const send = () => {
        if (text) {
            dispatch(send_message({
                userId: userInfo.id,
                text,
                sellerId,
                name: userInfo.name
            }))
            setText('')
        }

    }

    useEffect(() => {
        socket.on('seller_message', msg => {
            setReceverMessage(msg)
        })
        socket.on('activeSeller', (sellers) => {
            setActiveSeller(sellers)
        })
    }, [])

    useEffect(() => {
        if (successMessage) {
            socket.emit('send_customer_message', fd_messages[fd_messages.length - 1])
            dispatch(messageClear())
        }
    }, [dispatch, fd_messages, successMessage])

    useEffect(() => {
        if (receverMessage) {
            if (sellerId === receverMessage.senderId && userInfo.id === receverMessage.receverId) {
                dispatch(updateMessage(receverMessage))
            } else {
                toast.success(receverMessage.senderName + " " + "send a message")
                dispatch(messageClear())
            }
        }
    }, [dispatch, sellerId, userInfo, receverMessage])

    /*  useEffect(() => {
         scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
     }, [fd_messages]) */

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, [fd_messages]);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [fd_messages]);
    return (
        <div className="w-full h-[calc(100vh-160px)] rounded-md bg-gradient-to-b from-slate-800 to-slate-900 p-4">
            <div className="flex w-full h-full relative">

                {/* Mobile overlay */}
                {show && (
                    <div
                        className="fixed inset-0 bg-black/40 z-[9] md:hidden"
                        onClick={() => setShow(false)}
                        aria-hidden="true"
                    />
                )}

                {/* Sidebar */}
                <aside className={`w-[300px] h-full absolute z-[10] ${show ? 'left-0' : '-left-[340px]'} md:left-0 md:relative transition-all duration-300`}>
                    <div className="h-full bg-slate-900/60 md:bg-transparent border border-slate-700/40 rounded-md md:border-none overflow-hidden">
                        {/* Sidebar header */}
                        <div className="h-[56px] px-3 flex items-center gap-3 bg-slate-900/70 md:bg-transparent text-slate-200">
                            <AiOutlineMessage className="text-xl" />
                            <span className="font-semibold">Messages</span>
                        </div>

                        {/* Friends list */}
                        <div className="h-[calc(100%-56px)] overflow-y-auto p-2 space-y-2">
                            {my_friends?.map((f, i) => {
                                const active = String(f.fdId) === String(sellerId);
                                return (
                                    <Link key={i} to={`/dashboard/chat/${f.fdId}`} onClick={() => setShow(false)}>
                                        <div
                                            className={`flex items-center gap-3 px-3 py-2 rounded-md border transition ${active
                                                ? 'bg-slate-700/60 border-cyan-500/60 ring-1 ring-cyan-400/30'
                                                : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/60 hover:border-slate-600'
                                                }`}
                                        >
                                            <div className="relative shrink-0">
                                                <img
                                                    className="w-10 h-10 rounded-full border-2 border-white/10 object-cover"
                                                    src={f?.image || FALLBACK_AVATAR}
                                                    alt={f?.name || 'User'}
                                                    onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)}
                                                />
                                                {
                                                    activeSeller.some(c => c.sellerId === f.fdId) ? <span className="absolute right-0 bottom-0 w-[10px] h-[10px] rounded-full bg-green-500 ring-2 ring-slate-800" /> : <span className="absolute right-0 bottom-0 w-[10px] h-[10px] rounded-full bg-gray-300 ring-2 ring-slate-800" />
                                                }

                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-slate-100 text-sm font-semibold truncate">{f?.name || 'User'}</h3>
                                                {/* ভবিষ্যতে লাস্ট মেসেজ চাইলে এখানে রাখবেন */}
                                                {
                                                    activeSeller.some(c => c.sellerId === f.fdId) ? <p className="text-xs text-slate-400 truncate">Tap to open</p> : <p className="text-xs text-slate-400 truncate">Inactive</p>
                                                }

                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                            {!my_friends?.length && (
                                <div className="text-slate-400 text-sm px-3">No conversations yet.</div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main chat area */}
                <main className="w-full md:w-[calc(100%-300px)] md:pl-4 h-full">
                    {currentFd ? (
                        <div className="h-full flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                                {sellerId && (
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img
                                                className="w-11 h-11 rounded-full border-2 border-emerald-500/60 object-cover"
                                                src={currentFd?.image || FALLBACK_AVATAR}
                                                alt={currentFd?.name || 'Friend'}
                                                onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)}
                                            />
                                            {
                                                activeSeller.some(c => c.sellerId === currentFd.fdId) ? <span className="absolute right-0 bottom-0 w-[10px] h-[10px] rounded-full bg-green-500 ring-2 ring-slate-800" /> : <span className="absolute right-0 bottom-0 w-[10px] h-[10px] rounded-full bg-gray-300 ring-2 ring-slate-800" />
                                            }
                                        </div>
                                        <h2 className="text-base font-semibold text-slate-100">{currentFd?.name}</h2>
                                    </div>
                                )}

                                <button
                                    onClick={() => setShow(!show)}
                                    className="w-[36px] h-[36px] md:hidden rounded-md bg-cyan-600 hover:bg-cyan-500 text-white grid place-items-center shadow"
                                    aria-label="Toggle conversation list"
                                >
                                    <FaList />
                                </button>
                            </div>

                            {/* Chat body */}
                            <div ref={listRef} className="flex-1 bg-slate-800/60 rounded-md p-3 overflow-y-auto border border-slate-700/40 space-y-3">
                                {/* Sample thread (আপনার fd_messages অনুযায়ী এখানে ম্যাপ করতে পারেন) */}
                                {
                                    fd_messages?.map((m, i) => {
                                        if (currentFd?.fdId !== m.receverId) {
                                            return (
                                                <div key={i} className="w-full flex justify-start">
                                                    <div className="flex items-start gap-2 md:px-1 py-1 max-w-[85%]">
                                                        <img
                                                            className="w-9 h-9 rounded-full border-2 border-emerald-500/60 object-cover"
                                                            src={currentFd?.image || FALLBACK_AVATAR}
                                                            alt="avatar"
                                                            onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)}
                                                        />
                                                        <div className="bg-slate-700 text-slate-100 px-3 py-2 rounded-md shadow">
                                                            <span>{m?.message}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div key={i} className="w-full flex justify-end">
                                                    <div className="flex items-start gap-2 md:px-1 py-1 max-w-[85%]">
                                                        <div className="bg-cyan-600 text-white px-3 py-2 rounded-md shadow">
                                                            <span>{m?.message}</span>
                                                        </div>
                                                        <img
                                                            className="w-9 h-9 rounded-full border-2 border-emerald-500/60 object-cover"
                                                            src={userInfo?.image || userImage}
                                                            alt="me"
                                                            onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })
                                }
                                {/* আরও স্যাম্পল */}

                            </div>

                            {/* Composer */}
                            <div className="mt-3 flex items-center gap-2">
                                <label className="w-[40px] h-[40px] grid place-items-center rounded-full border border-slate-600 text-slate-200 hover:bg-slate-700 cursor-pointer">
                                    <AiOutlinePlus />
                                    <input className="hidden" type="file" />
                                </label>

                                <div className="flex-1 flex items-center gap-2 bg-slate-800/60 border border-slate-600 rounded-md px-2">
                                    <input
                                        value={text} onChange={(e) => setText(e.target.value)}
                                        className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-400 outline-none py-2"
                                        type="text"
                                        placeholder="Type your message..."
                                    />
                                    <FaRegSmile className="text-slate-300" size={20} />
                                </div>

                                <button
                                    onClick={send}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold h-[40px] px-4 rounded-md shadow flex items-center gap-1"
                                    type="button"
                                    aria-label="Send message"
                                >
                                    Send <IoIosSend />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => setShow(true)}
                            className="w-full h-full grid place-items-center text-slate-200 border border-slate-00"
                        >
                            <div className="text-center ">
                                <div className="text-4xl font-bold">Select a conversation</div>
                                <p className="text-slate-400 mt-1">Choose a seller from the list to start chatting</p>
                                <button
                                    className="mt-4 md:hidden bg-cyan-600 hover:bg-cyan-500 text-white rounded-md px-4 py-2"
                                    type="button"
                                >
                                    Open list
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Chat;