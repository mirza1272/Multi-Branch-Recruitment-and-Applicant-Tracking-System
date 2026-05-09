import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL.replace('/rest/v1/', ''); // Clean URL if needed
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BUCKET_NAME = 'resumes'

/**
 * Upload a file buffer to Supabase Storage
 * @param {Buffer} fileBuffer 
 * @param {string} fileName 
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadToSupabase = async (fileBuffer, fileName) => {
    try {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, fileBuffer, {
                contentType: 'application/pdf',
                upsert: true
            })

        if (error) throw error

        const { data: publicData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path)

        return {
            url: publicData.publicUrl,
            path: data.path
        }
    } catch (error) {
        console.error('Supabase Upload Error:', error.message)
        throw error
    }
}

/**
 * Delete a file from Supabase Storage
 * @param {string} fileUrl 
 */
export const deleteFromSupabase = async (fileUrl) => {
    if (!fileUrl) return
    try {
        // Extract path from public URL
        // Example URL: https://xxx.supabase.co/storage/v1/object/public/resumes/filename.pdf
        const urlParts = fileUrl.split(`${BUCKET_NAME}/`)
        if (urlParts.length < 2) return
        
        const path = urlParts[1]
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([path])

        if (error) throw error
    } catch (error) {
        console.error('Supabase Delete Error:', error.message)
    }
}
