import { Router } from express;

const router = Rounter()
router.route('/')
  .get(getUserProfile)
  .put(updateUserProfile)

export default router;