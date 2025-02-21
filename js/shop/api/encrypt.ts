// 3des-ecb加密
import CryptoJS from 'crypto-js';
import TripleDES from 'crypto-js/tripledes';
// rsa加密
import { JSEncrypt } from 'jsencrypt/lib/JSEncrypt';

function encrypt3DES_ECB(obj: object, key: string) {
  if (
    obj === undefined ||
    obj === null ||
    typeof obj === 'function' ||
    typeof obj === 'symbol'
  )
    return;
  // 数组
  if (Array.isArray(obj)) {
    return obj.map((ele) => encrypt3DES_ECB(ele, key));
  }
  // 对象
  if (typeof obj === 'object') {
    const ret = {};
    for (const [k, v] of Object.entries(obj)) {
      ret[k] = encrypt3DES_ECB(v, key);
    }
    return ret;
  }
  // 其他类型转成字符串再加密（bigint、number、boolean、string）
  const str = obj + '';
  return TripleDES.encrypt(str, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
}

// RSA加密器
const RSAPublicKey = '1234567890';
const RSA = new JSEncrypt({});
RSA.setPublicKey(RSAPublicKey);

// 缓存上一次的sign、deskey
let lastDeskey = '';
let lastSign = '';
const selectChar = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];
// 参数加密
function encryptParams(params: object) {
  //@ts-expect-error
  const { token = UGUserModel.getToken() } = params;
  params = { ...params, checkSign: 1, token };

  let deskey = ''; // 每次加密都随机生成解密密钥key
  for (let i = 0; i < 32; i++) {
    const charIndex = Math.floor(Math.random() * selectChar.length);
    deskey += selectChar[charIndex];
  }
  let sign = RSA.encrypt(`iOS_${deskey}`)?.toString();
  // sign有低概率可能会为空（iOS部分机型几十份之一概率），这时取上一次的签名也可用（sign和deskey是一起的也得取上一次的值）
  if (sign?.length) {
    lastDeskey = deskey;
    lastSign = sign;
  } else {
    deskey = lastDeskey;
    sign = lastSign;
  }
  console.log('deskey =', deskey);
  const ret = encrypt3DES_ECB(params, deskey);
  ret['sign'] = sign;
  return ret;
}

export { encryptParams };
