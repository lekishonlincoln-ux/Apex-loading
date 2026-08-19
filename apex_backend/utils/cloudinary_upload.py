import cloudinary.uploader


def upload_avatar(file, user_id: str) -> str:
    result = cloudinary.uploader.upload(
        file,
        folder='apex/avatars',
        public_id=f'user_{user_id}',
        overwrite=True,
        resource_type='image',
        transformation=[{'width': 400, 'height': 400, 'crop': 'fill', 'gravity': 'face'}],
    )
    return result['secure_url']


def upload_evidence(file, job_id: str, index: int) -> str:
    result = cloudinary.uploader.upload(
        file,
        folder='apex/evidence',
        public_id=f'job_{job_id}_ev_{index}',
        overwrite=True,
        resource_type='auto',
    )
    return result['secure_url']
