import { useEffect, useState, useRef } from "react";
import { support, noSupport, chatSupport } from "../../public/assets";
import Image from "next/image";
import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";
import { MdSend } from "react-icons/md";
import { BiSolidImageAdd } from "react-icons/bi";
import logo from "../../public/logo.png";
import { useAuth } from "../../context/AuthContext";
import { date } from "yup";
import Link from "next/link";

const SupportChat = () => {
  const refChat = useRef(null);

  const handleClickOutside = (event) => {
    if (refChat.current && !refChat.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const {
    isMentorLoggedIn,
    setIsMentorLoggedIn,
    isUserLoggedIn,
    setIsUserLoggedIn,
  } = useAuth();

  const userData = JSON.parse(localStorage.getItem("userData"));
  const mentorData = JSON.parse(localStorage.getItem("mentorData"));

  useEffect(() => {
    if (userData?.user_name) {
      setIsUserLoggedIn(true);
    }

    if (mentorData?.mentor_name) {
      setIsMentorLoggedIn(true);
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [imageValue, setImageValue] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setImageValue(file);

    const reader = new FileReader();
    reader.onloadend = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      text: inputValue,
      sender:
        userData?.user_name || mentorData?.mentor_name ? "user" : "support",
      time: new Date(),
      image: imageValue,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    setImageValue(null);
    setImagePreview(null);
  };

  return (
    <>
      <div
        ref={refChat}
        className="sm:tw-mr-8 tw-flex tw-z-[1000] tw-text-center tw-fixed tw-bottom-0 tw-right-0 sm:tw-mb-32 tw-cursor-pointer"
      >
        {isOpen ? (
          <>
            <div className="sm:tw-flex tw-w-[280px] tw-h-[380px] tw-hidden tw-flex-col tw-bg-cyan-200 tw-shadow-lg tw-rounded-md tw-outline-black tw-overflow-y-scroll tw-overflow-x-hidden tw-justify-between">
              {/* header part */}
              <div className="tw-flex tw-text-center tw-justify-between tw-w-full tw-items-center tw-top-0 tw-sticky tw-bg-cyan-200 tw-z-40">
                <div className="tw-flex tw-items-center tw-justify-center">
                  <Image src={logo} alt="logo" width={55} height={55} />
                  <h1 className="tw-text-md tw-font-bold tw-text-cyan-700">
                    Support
                  </h1>
                  <p className="tw-ml-2">
                    {userData?.user_name || mentorData?.mentor_name}
                  </p>
                </div>
                <AiOutlineClose
                  onClick={() => setIsOpen(false)}
                  className="tw-w-6 tw-h-6 tw-relative tw-text-red-500 hover:tw-text-red-600 tw-ease-in-out tw-transition-all tw-mr-3"
                />
              </div>

              {/* body */}

              <div
                className={`tw-flex tw-flex-col ${
                  isMentorLoggedIn || isUserLoggedIn ? "" : "tw-justify-center"
                }`}
              >
                {isUserLoggedIn || isMentorLoggedIn ? (
                  <div className="tw-flex tw-flex-col tw-h-[300px] tw-overflow-y-scroll tw-overflow-x-hidden tw-gap-1 tw-text-center tw-w-full">
                    {messages.length === 0 && (
                      <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-3">
                        <Image
                          src={chatSupport}
                          alt="chatSupport"
                          width={120}
                          height={120}
                        />
                        <h1 className="tw-text-indigo-400 tw-font-bold tw-text-xl">
                          No messages yet.
                        </h1>
                        <p>Start the conversation.</p>
                      </div>
                    )}
                    {/* messages */}
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`tw-relative tw-flex tw-flex-col ${
                          message.sender === "support"
                            ? "tw-text-left tw-justify-start"
                            : "tw-text-right tw-justify-end tw-items-end"
                        } tw-gap-1`}
                      >
                        {message?.image && (
                          <Image
                            onClick={() =>
                              window.open(URL.createObjectURL(message.image))
                            }
                            src={URL.createObjectURL(message?.image)}
                            alt="Uploaded Image"
                            width={120}
                            height={120}
                            className="tw-rounded-sm"
                          />
                        )}

                        {message?.text && (
                          <div
                            className={`${
                              message.text.length > 20
                                ? "tw-w-[200px] tw-bg-indigo-400"
                                : "tw-w-[100px] tw-bg-indigo-400"
                            } tw-rounded-md tw-p-2 tw-m-1 tw-text-white tw-text-sm tw-break-words tw-shadow-lg tw-opacity-80 hover:tw-opacity-100 ${
                              isOpen ? "tw-opacity-100" : "tw-opacity-80"
                            }`}
                          >
                            {message?.text}
                          </div>
                        )}
                        {message?.time && (message?.text || message?.image) && (
                          <p className="tw-text-xs tw-ml-2 tw-mb-0.5 tw-text-gray-500">
                            {message.time.toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-3">
                    <Image
                      src={noSupport}
                      alt="noSupport"
                      width={120}
                      height={120}
                    />
                    <h1 className="tw-text-indigo-400 tw-font-bold tw-text-xl">
                      You are not logged in.
                    </h1>
                    <Link
                      href={"/contact"}
                      className="tw-font-semibold tw-no-underline hover:tw-text-indigo-400"
                    >
                      Contact Us
                    </Link>
                    <p>OR</p>
                    <h2>
                      Please{" "}
                      <Link
                        className="tw-text-indigo-400 hover:tw-text-indigo-500 tw-ease-in-out"
                        href="/auth/login?entityType=user"
                      >
                        Sign In
                      </Link>{" "}
                      to chat with us.
                    </h2>
                  </div>
                )}

                {/* form */}
                <form
                  onSubmit={handleTextSubmit}
                  className="tw-flex tw-flex-col tw-m-2 tw-sticky tw-bottom-0  tw-gap-2 tw-text-center tw-justify-between tw-w-full tw-items-start tw-top-0 tw-bg-cyan-200  tw-z-40"
                >
                  {imagePreview && (
                    <div
                      className={`tw-rounded-sm tw-bg-slate-300 tw-p-1 tw-flex tw-gap-3`}
                    >
                      <Image
                        src={imagePreview}
                        alt="Image Preview"
                        width={90}
                        height={90}
                      />
                      <AiOutlineCloseCircle
                        onClick={() => {
                          setImagePreview(null);
                          setImageValue(null);
                        }}
                        className="tw-w-6 tw-h-6 tw-relative tw-text-red-500 hover:tw-text-red-600 tw-ease-in-out tw-transition-all"
                        title="cancel"
                      />
                    </div>
                  )}
                  {isMentorLoggedIn ||
                    (isUserLoggedIn && (
                      <div className="tw-flex tw-text-center tw-justify-between tw-w-[280px] tw-items-center tw-bottom-0 tw-z-40">
                        <label htmlFor="imageValue" className="tw-relative">
                          <BiSolidImageAdd className="tw-w-6 tw-h-6 tw-text-indigo-400 hover:tw-text-indigo-500 tw-ease-in-out tw-transition-all tw-cursor-pointer tw-items-center tw-text-center tw-justify-center tw-flex" />
                        </label>
                        <input
                          className="tw-hidden"
                          id="imageValue"
                          type="file"
                          onChange={handleImageChange}
                        />
                        <input
                          className="tw-p-1 tw-rounded-md tw-border tw-border-gray-300 tw-placeholder-gray-500 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400 focus:tw-border-transparent"
                          type="text"
                          value={inputValue}
                          onChange={(event) =>
                            setInputValue(event.target.value)
                          }
                        />

                        {/* Only when mentor or user is logged in, can send the message */}
                        {isMentorLoggedIn || isUserLoggedIn ? (
                          <button title="send" type="submit">
                            <MdSend className="tw-w-6 tw-h-6 tw-text-indigo-400 tw-mr-3" />
                          </button>
                        ) : (
                          <button type="button">
                            <Link
                              className="tw-bg-indigo-400 tw-w-1/2 tw-text-sm tw-rounded-sm tw-font-semibold tw-text-white tw-p-1 hover:tw-bg-indigo-500 tw-ease-in-out"
                              href="/"
                            >
                              Sign In
                            </Link>
                          </button>
                        )}
                      </div>
                    ))}
                </form>
              </div>
            </div>

            {/* for Mobile devices */}
            <div className="sm:tw-hidden tw-w-screen tw-h-screen tw-flex tw-flex-col tw-bg-cyan-200 tw-overflow-y-scroll tw-overflow-x-hidden tw-justify-between tw-cursor-auto">
              {/* header */}
              <div className="tw-py-6 tw-flex tw-text-center tw-justify-between tw-w-full tw-items-center tw-top-0 tw-sticky tw-bg-cyan-200 tw-z-40">
                <div className="tw-flex tw-items-center tw-justify-center">
                  <Image src={logo} alt="logo" width={55} height={55} />
                  <h1 className="tw-text-md tw-font-bold tw-text-cyan-700">
                    Support
                  </h1>
                </div>
                <p className="tw-text-center tw-items-center tw-flex tw-justify-center tw-mr-9">
                  {userData?.user_name || mentorData?.mentor_name}
                </p>
                <AiOutlineClose
                  onClick={() => setIsOpen(false)}
                  className="tw-w-6 tw-h-6 tw-relative tw-text-red-500 hover:tw-text-red-600 tw-ease-in-out tw-transition-all tw-mr-4"
                />
              </div>

              {/* body */}
              <div
                className={`tw-flex tw-flex-col ${
                  isMentorLoggedIn || isUserLoggedIn ? "" : "tw-justify-center"
                }`}
              >
                {isUserLoggedIn || isMentorLoggedIn ? (
                  <div className="tw-flex tw-flex-col tw-overflow-y-scroll tw-overflow-x-hidden tw-gap-1 tw-text-center tw-w-full">
                    {messages.length === 0 && (
                      <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-3">
                        <Image
                          src={chatSupport}
                          alt="chatSupport"
                          width={120}
                          height={120}
                        />
                        <h1 className="tw-text-indigo-400 tw-font-bold tw-text-xl">
                          No messages yet.
                        </h1>
                        <p>Start the conversation.</p>
                      </div>
                    )}
                    {/* messages */}
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`tw-relative tw-flex tw-flex-col tw-mr-3 tw-ml-2 ${
                          message.sender === "support"
                            ? "tw-text-left tw-justify-start"
                            : "tw-text-right tw-justify-end tw-items-end"
                        } tw-gap-1`}
                      >
                        {message?.image && (
                          <Image
                            onClick={() =>
                              window.open(URL.createObjectURL(message.image))
                            }
                            src={URL.createObjectURL(message?.image)}
                            alt="Uploaded Image"
                            width={120}
                            height={120}
                            className="tw-rounded-sm"
                          />
                        )}

                        {message?.text && (
                          <div
                            className={`${
                              message.text.length > 20
                                ? "tw-w-[200px] tw-bg-indigo-400"
                                : "tw-w-[100px] tw-bg-indigo-400"
                            } tw-rounded-md tw-p-2 tw-m-1 tw-text-white tw-text-sm tw-break-words tw-shadow-lg tw-opacity-80 hover:tw-opacity-100 ${
                              isOpen ? "tw-opacity-100" : "tw-opacity-80"
                            }`}
                          >
                            {message?.text}
                          </div>
                        )}
                        {message?.time && (message?.text || message?.image) && (
                          <p className="tw-text-xs tw-ml-2 tw-mb-0.5 tw-text-gray-500">
                            {message.time.toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="tw-flex tw-flex-col tw-justify-around tw-items-center tw-gap-3">
                    <Image
                      src={noSupport}
                      alt="noSupport"
                      width={120}
                      height={120}
                    />
                    <h1 className="tw-text-indigo-400 tw-font-bold tw-text-xl">
                      You are not logged in.
                    </h1>
                    <Link
                      href={"/contact"}
                      className="tw-font-semibold tw-no-underline hover:tw-text-indigo-400"
                    >
                      Contact Us
                    </Link>
                    <p>OR</p>
                    <h2>
                      Please{" "}
                      <Link
                        className="tw-text-indigo-400 hover:tw-text-indigo-500 tw-ease-in-out"
                        href="/auth/login?entityType=user"
                      >
                        Sign In
                      </Link>{" "}
                      to chat with us.
                    </h2>
                  </div>
                )}
              </div>

              {/* form */}
              <form
                onSubmit={handleTextSubmit}
                className="tw-flex tw-flex-col tw-m-2 tw-sticky tw-bottom-0  tw-gap-2 tw-text-center tw-justify-between tw-w-full tw-items-start tw-top-0 tw-bg-cyan-200  tw-z-40"
              >
                {imagePreview && (
                  <div
                    className={`tw-rounded-sm tw-bg-slate-300 tw-p-1 tw-flex tw-gap-3`}
                  >
                    <Image
                      src={imagePreview}
                      alt="Image Preview"
                      width={120}
                      height={120}
                    />
                    <AiOutlineCloseCircle
                      onClick={() => {
                        setImagePreview(null);
                        setImageValue(null);
                      }}
                      className="tw-w-6 tw-h-6 tw-relative tw-text-red-500 hover:tw-text-red-600 tw-ease-in-out tw-transition-all"
                      title="cancel"
                    />
                  </div>
                )}
                {isMentorLoggedIn ||
                  (isUserLoggedIn && (
                    <div className="tw-flex tw-text-center tw-justify-between tw-w-full tw-items-center tw-py-2 tw-z-40 tw-gap-2">
                      <label htmlFor="imageValue" className="tw-relative">
                        <BiSolidImageAdd className="tw-w-6 tw-h-6 tw-text-indigo-400 hover:tw-text-indigo-500 tw-ease-in-out tw-transition-all tw-cursor-pointer tw-items-center tw-text-center tw-justify-center tw-flex" />
                      </label>
                      <input
                        className="tw-hidden"
                        id="imageValue"
                        type="file"
                        onChange={handleImageChange}
                      />
                      <input
                        className="tw-p-1 tw-w-full tw-rounded-md tw-border tw-border-gray-300 tw-placeholder-gray-500 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400 focus:tw-border-transparent"
                        type="text"
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                      />

                      {/* Only when mentor or user is logged in, can send the message */}
                      {isMentorLoggedIn || isUserLoggedIn ? (
                        <button title="send" type="submit">
                          <MdSend className="tw-w-6 tw-h-6 tw-text-indigo-400 tw-mr-3" />
                        </button>
                      ) : (
                        <button type="button">
                          <Link
                            className="tw-bg-indigo-400 tw-w-1/2 tw-text-sm tw-rounded-sm tw-font-semibold tw-text-white tw-p-1 hover:tw-bg-indigo-500 tw-ease-in-out"
                            href="/"
                          >
                            Sign In
                          </Link>
                        </button>
                      )}
                    </div>
                  ))}
              </form>
            </div>
          </>
        ) : (
          <>
            {/* For desktop devices */}
            <button
              onClick={() => setIsOpen(true)}
              className="tw-hidden sm:tw-flex"
            >
              <Image
                className={`tw-rounded-full tw-bg-[#845ec2] hover:tw-bg-[#845ec0] tw-p-2 tw-shadow-lg tw-opacity-80 hover:tw-opacity-100 ${
                  isOpen ? "tw-opacity-100" : "tw-opacity-80"
                }`}
                title="support"
                src={support}
                alt="support"
                width={50}
                height={50}
              />
            </button>

            {/* For mobile devices */}
            <button
              onClick={() => setIsOpen(true)}
              className="tw-flex sm:tw-hidden tw-mb-44 tw-mr-8"
            >
              <Image
                className={`tw-rounded-full tw-bg-[#845ec2] hover:tw-bg-[#845ec0] tw-p-2 tw-shadow-lg tw-opacity-80 hover:tw-opacity-100 ${
                  isOpen ? "tw-opacity-100" : "tw-opacity-80"
                }`}
                title="support"
                src={support}
                alt="support"
                width={50}
                height={50}
              />
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default SupportChat;
