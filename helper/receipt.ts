import { NEXT_API_URL } from "@/constants/api"
import { getSession } from "./session";


//scan
export const getReceiptContent =  async (image: string) => {
    const session = await getSession();
    const dataS = {
        image: `data:image/jpeg;base64,${image}`
    }
    try {
        const request = await fetch(`${NEXT_API_URL}/api/scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session}`
            },
            body: JSON.stringify(dataS)
        });
        const data = await request.json();
        if(request.ok) {
            return data;
        }
        else {
            throw new Error(data?.message);
        }
    } catch (error) {
        console.log(error)    
    }
}
//save
export const saveReceiptContent = async (receipt: unknown) => {
    const session = await getSession();
    try {
        const req = await fetch(`${NEXT_API_URL}/api/receipt`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session}`
            },
            body: JSON.stringify(receipt)
        });
        const data = await req.json();

        if(req.ok) {
            return data;
        }
        else {
            throw new Error(data?.message)
        }
    } catch (error) {
        console.log(error)
    }
}

export const uploadImageReceipt = async (image: File) => {
    const session = await getSession();
    try {
        const uploadImageRequest = await fetch(`${NEXT_API_URL}/api/receipt/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session}`
            },
            body: image
        })

        return uploadImageRequest
    } catch (error) {
        console.log(error);
    }
}

//update
export const patchReceiptContent = async (receipt: unknown) => {
    const session = await getSession();
    try {
        const req = await fetch(`${NEXT_API_URL}/api/receipt`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session}`
            },
            body: JSON.stringify(receipt)
        });
        const data = await req.json();
        
        return req;

    } catch (error) {
        console.log(error)
    }
}

//get receipt using ID
export const getReceiptContentById = async (id: string) => {
    const session = await getSession();
    try {
        const req = await fetch(`${NEXT_API_URL}/api/receipt?id=${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session}`
            }
        });
        const data = await req.json();
        
        return data;

    } catch (error) {
        console.log(error)
    }
}

export async function uriToBlob(uri: string) {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  }