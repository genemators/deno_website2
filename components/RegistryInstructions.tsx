/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import Transition from "./Transition";
import InlineCode from "./InlineCode";
import { getVersionList } from "../util/registry_utils";

const VALID_NAME = /^[a-z0-9_]{3,40}$/,
  VALID_SUBDIRECTORY = /^([^(/)])(.*\/$)/;

function RegistryInstructions(props: {
  isOpen: boolean;
  close: () => void;
}): React.ReactElement {
  // Stage of the instructions
  const [stage, setStage] = useState(0);

  // Name of the module to be registered
  const [moduleName, setModuleName] = useState("");

  // Subdirectory where the repository is located
  const [subdirectory, setSubdirectory] = useState("");

  // Validity of the module name
  const isModuleNameValid = useMemo(() => VALID_NAME.test(moduleName), [
    moduleName,
  ]);
  const { data: isModuleNameAvailable } = useSWR(
    () => (isModuleNameValid ? moduleName : null),
    (moduleName) =>
      getVersionList(moduleName)
        .then((e) => !e)
        .catch(() => false),
    { refreshInterval: 2000 }
  );

  // Validity of the subdirectory
  const isSubdirectoryValid = useMemo(
    () => !subdirectory || VALID_SUBDIRECTORY.test(subdirectory),
    [subdirectory]
  );

  // No page scroll when sidebar is open
  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.marginRight = "15px";
    } else {
      document.body.style.overflow = "";
      document.body.style.marginRight = "";
    }
  }, [props.isOpen]);

  return (
    <Transition show={props.isOpen}>
      <div className="fixed z-10 inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Transition
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={props.close}
            />
          </Transition>
          <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative w-screen max-w-md md:max-w-lg lg:max-w-xl xl:max-w-4xl">
                <Transition
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                    <button
                      aria-label="Panelni yopish"
                      className="text-gray-300 hover:text-white transition ease-in-out duration-150"
                      onClick={props.close}
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </Transition>
                <div className="h-full flex flex-col space-y-4 my-auto px-4 md:px-16 lg:px-24 xl:px-32 bg-white shadow-xl overflow-y-auto">
                  <div className="my-auto py-10">
                    <header>
                      <h2 className="text-xl leading-7 font-medium text-gray-900">
                        {stage === 0 && "Modul qo'shish"}
                        {stage === 1 && "Modul uchun nom tanlash"}
                        {stage === 2 && "Qo'shimcha tanlovlar"}
                        {stage === 3 && "Webhook taqdim etish"}
                      </h2>
                    </header>
                    <div className="space-y-4">
                      {stage === 0 && (
                        <>
                          <p className="text-base">
                            Hamma{" "}
                            <b className="font-semibold">deno.land/x</b> dagi modullar
                            GitHub.com da ochiq manba asosida taqdim etilishi shart.
                          </p>
                          <p className="text-base">
                            Har safar repozitoriyadan versiya taqdim etilganda,{" "}
                            <b className="font-semibold">deno.land/x</b>{" "}
                            hammasini yuklab, hammaga taqdim etadi. Biz buni
                            har bir versiya uchun bir marotaba amalga oshiramiz.
                            Bu esa har bir versiyada ma'lumotlar adashib ketmasligini
                            ta'minlaydi.
                          </p>
                          <p className="text-base">
                            Bizning servis har safar versiya taqdim etilganda
                            habardor bo'lib turishi zarurdir. Shuning uchun ham
                            biz GitHub webhooks ishlatamiz.
                          </p>
                          <span className="block w-full rounded-md shadow-sm mt-4">
                            <button
                              type="submit"
                              className="w-full flex justify-center py-2 px-4 mt-12 border border-gray-300 text-md font-medium rounded-md text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out"
                              onClick={() => setStage(1)}
                            >
                              Keyingi
                            </button>
                          </span>
                        </>
                      )}
                      {stage === 1 && (
                        <>
                          <p>Boshlash uchun modulga nom bering:</p>
                          <div>
                            <label
                              htmlFor="modulename"
                              className="font-semibold sr-only"
                            >
                              Module nomi
                            </label>
                            <input
                              id="modulename"
                              className={`block w-full px-4 py-2 my-1 leading-normal bg-white border border-gray-200 rounded-lg outline-none shadow hover:shadow-sm focus:shadow-sm appearance-none focus:border-gray-300 hover:border-gray-300 mt-1 ${
                                isModuleNameValid &&
                                isModuleNameAvailable === true
                                  ? "border-green-300 hover:border-green-300 focus:border-green-300"
                                  : !isModuleNameValid ||
                                    isModuleNameAvailable === false
                                  ? "border-red-300 hover:border-red-300 focus:border-red-300"
                                  : ""
                              }`}
                              type="text"
                              placeholder="Module Name"
                              value={moduleName}
                              onChange={(e) => setModuleName(e.target.value)}
                            />
                            {isModuleNameAvailable === true ? (
                              <p className="text-green-500 mb-2">
                                Bu modul oldindan mavjud.
                              </p>
                            ) : isModuleNameAvailable === false ? (
                              <p className="text-red-400 mb-2">
                                Bu modul nomi yangi muharrir uchun mavjud emas.
                                Agar ushbu modul sizning nomingizga kiritilgan
                                bo'lsa, keyingi tugmasini bosing.
                              </p>
                            ) : null}
                            {!isModuleNameValid ? (
                              <span className="text-red-400">
                                Modul nomi harflar soni 3 dan 40 tagacha
                                bo'lishi lozim va ushbu nom oddiy alfabet
                                harflari, 0 dan 9 gacha bo'lgan sonlar va "_"
                                belgisidan tashkil topishi mumkin.
                              </span>
                            ) : null}
                          </div>
                          <span className="block w-full rounded-md shadow-sm">
                            <button
                              type="submit"
                              disabled={!isModuleNameValid ? true : undefined}
                              className={`w-full flex justify-center py-2 px-4 mt-12 border border-gray-300 text-md font-medium rounded-md ${
                                isModuleNameValid
                                  ? "text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50"
                                  : "text-gray-400 bg-gray-50 cursor-default"
                              } focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out`}
                              onClick={() => setStage(2)}
                            >
                              Keyingi
                            </button>
                          </span>
                          <button className="link" onClick={() => setStage(0)}>
                            Orqaga
                          </button>
                        </>
                      )}
                      {stage === 2 && (
                        <>
                          <p>
                            Ushbu sahifada sozlanishi kerak bo'lgan optsional sozlamalar mavjud:
                          </p>
                          <div className="mt-2">
                            <label
                              htmlFor="subdirectory"
                              className="font-medium"
                            >
                              Sabdirektoriya
                            </label>
                            <input
                              id="subdirectory"
                              className={`block w-full px-4 py-2 my-1 leading-normal bg-white border border-gray-200 rounded-lg outline-none shadow hover:shadow-sm focus:shadow-sm appearance-none focus:border-gray-300 hover:border-gray-300 mt-1 ${
                                isSubdirectoryValid
                                  ? "border-green-300 hover:border-green-300 focus:border-green-300"
                                  : !isSubdirectoryValid
                                  ? "border-red-300 hover:border-red-300 focus:border-red-300"
                                  : ""
                              }`}
                              type="text"
                              placeholder="Sabdirektoriya"
                              value={subdirectory}
                              onChange={(e) => setSubdirectory(e.target.value)}
                            />
                            {!isSubdirectoryValid ? (
                              <p className="text-red-400 mb-2">
                                Kiritilgan sabdirektoriya mavjud emas. Ushbu
                                qiymat <InlineCode>/</InlineCode> bilan tugashi
                                shart, hamda shu bilan boshlanmaydi. (misol:{" "}
                                <InlineCode>src/</InlineCode>)
                              </p>
                            ) : null}
                            <span className="text-gray-500">
                              Optsional. Taqdim etilishi kerak bo'lgan
                              repozitoriyadagi manzil.
                            </span>
                          </div>
                          <span className="block w-full rounded-md shadow-sm mt-2">
                            <button
                              type="submit"
                              disabled={!isSubdirectoryValid ? true : undefined}
                              className={`w-full flex justify-center py-2 px-4 mt-12 border border-gray-300 text-md font-medium rounded-md 
                              ${
                                isSubdirectoryValid
                                  ? "text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50"
                                  : "text-gray-400 bg-gray-50 cursor-default"
                              }  
                            text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out`}
                              onClick={() => setStage(3)}
                            >
                              Keyingi
                            </button>
                          </span>
                          <button className="link" onClick={() => setStage(1)}>
                            Orqaga
                          </button>
                        </>
                      )}
                      {stage === 3 && (
                        <>
                          <p>Endi esa repozitoriyangizga webhook qo'shishingiz mumkin.</p>
                          <ol className="list-decimal list-outside ml-4 pl-2 ">
                            <li>Kiritilishi kerak bo'lgan repozitoriyani oching.</li>
                            <li>
                              <InlineCode>Settings (Sozlamar)</InlineCode> oynachasini oching.
                            </li>
                            <li>
                              <InlineCode>Webhooks</InlineCode> tugmachasiga bosing{" "}
                              .
                            </li>
                            <li>
                              <InlineCode>Add webhook (Webhook qo'shish)</InlineCode>{" "}
                              tugmasini bosing.
                            </li>
                            <li>
                              URL (Manzil) kiriting{" "}
                              <InlineCode>
                                https://api.deno.land/webhook/gh/{moduleName}
                                {subdirectory
                                  ? `?subdir=${encodeURIComponent(
                                      subdirectory
                                    )}`
                                  : ""}
                              </InlineCode>{" "}
                              payload URL (kutilayotgan manzil) joyiga.
                            </li>
                            <li>
                              Kontent turi sifatida <InlineCode>application/json</InlineCode>{" "}
                              kiriting.
                            </li>
                            <li>
                              <InlineCode>
                                Let me select individual events. (O'zim taqdim etaman)
                              </InlineCode>{" "}
                              ni tanlang.
                            </li>
                            <li>
                              Faqatgina{" "}
                              <InlineCode>Branch or tag creation (Brend va teg yaratilishi)</InlineCode>{" "}
                              tugmasini belgilang.
                            </li>
                            <li>
                              <InlineCode>Add webhook (Webhook qo'shish)</InlineCode> tugmasini bosing.
                            </li>
                          </ol>
                          <video
                            className="rounded-md border border-gray-200 w-full"
                            src={"/images/add_webhook.mp4"}
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                          <div className="mt-2">
                            {isModuleNameAvailable ? (
                              <div className="text-gray-800 p-2 bg-gray-50 rounded-md border border-gray-200">
                                GitHubdan Birinchi sinov signallarini kelishi
                                kutilmoqda...
                              </div>
                            ) : (
                              <>
                                <div className="text-green-800 p-2 bg-gray-50 rounded-md border border-green-200">
                                  Modul muvaffaqiyatli kiritldi! Versiya taqdim etish uchun
                                  repozitoriyada / dan yangi teg yarating.
                                </div>
                                <div className="mt-4 rounded-md shadow-sm">
                                  <button
                                    className="w-full flex justify-center py-2 px-4 mt-12 border border-gray-300 text-md font-medium rounded-md text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out"
                                    onClick={props.close}
                                  >
                                    Bajarildi
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                          <button className="link" onClick={() => setStage(2)}>
                            Orqaga
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </section>
        </div>
      </div>
    </Transition>
  );
}

export default RegistryInstructions;
