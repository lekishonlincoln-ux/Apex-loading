import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Navbar from '../components/common/Navbar'
import { getMyProfile, updateProfile, uploadAvatar } from '../api/profileAPI'
import toast from 'react-hot-toast'
import { required } from '../utils/validators'

export default function ProfileSettingsPage() {
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm()

  useEffect(() => {
    getMyProfile().then(({ data }) => reset({
      ...data,
      skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills,
    })).catch(() => {})
  }, [reset])

  const onSubmit = async (data) => {
    try {
      await updateProfile({
        ...data,
        skills: data.skills.split(',').map((s) => s.trim()).filter(Boolean),
      })
      toast.success('Profile updated.')
    } catch {
      toast.error('Failed to update profile.')
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const form = new FormData()
    form.append('avatar', file)
    try {
      await uploadAvatar(form)
      toast.success('Avatar updated.')
    } catch {
      toast.error('Avatar upload failed.')
    }
  }

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ maxWidth: '640px' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Profile Settings</h2>
        <div className="card">
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 600 }}>Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ marginTop: '0.5rem' }} />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              ['full_name', 'Full Name'], ['headline', 'Headline'],
              ['profession', 'Profession'], ['location', 'Location'],
              ['country', 'Country'], ['portfolio_url', 'Portfolio URL'],
              ['linkedin_url', 'LinkedIn URL'],
            ].map(([name, label]) => (
              <div key={name}>
                <label>{label}</label>
                <input {...register(name, name === 'full_name' || name === 'profession' ? { validate: required } : {})} />
                {errors[name] && <span style={{ color: 'var(--color-error)', fontSize: '0.8rem' }}>{errors[name].message}</span>}
              </div>
            ))}
            <div>
              <label>Skills (comma-separated)</label>
              <input {...register('skills')} />
            </div>
            <div>
              <label>Years of Experience</label>
              <input type="number" min="0" {...register('years_experience')} />
            </div>
            <div>
              <label>Bio</label>
              <textarea rows={4} {...register('bio')} />
            </div>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
