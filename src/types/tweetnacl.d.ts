declare module "tweetnacl" {
	interface SignDetached {
		(message: Uint8Array, secretKey: Uint8Array): Uint8Array;
		verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean;
	}
	interface Sign {
		detached: SignDetached;
	}
	const nacl: { sign: Sign };
	export default nacl;
}
