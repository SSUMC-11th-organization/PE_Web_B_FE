import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { memberQueries } from "../../api/members/me";
import { ProfileAvatar } from "../../components/auth/profile-avatar";
import { Footer } from "../../components/layout/footer";
import { FavoritesGrid } from "../../components/profile/favorites-grid";
import { useAuthStore } from "../../stores/auth-store";
export function ProfilePage() {
  const token = useAuthStore((state) => state.accessToken);
  const { data: member } = useQuery(memberQueries.me(token));
  if (!member) return null;
  return (
    <div className="profile-page">
      <main className="profile-main">
        <section className="profile-content profile-overview" aria-labelledby="profile-title">
          <div className="profile-heading">
            <h1 id="profile-title">내 정보</h1>
            <Link className="primary-button compact-button" to="/profile/edit">
              정보 수정
            </Link>
          </div>
          <section className="profile-info" aria-labelledby="basic-info-title">
            <h2 id="basic-info-title">기본 정보</h2>
            <div className="profile-info-row">
              <ProfileAvatar imageUrl="" />
              <dl className="profile-details">
                <div>
                  <dt>닉네임</dt>
                  <dd>{member.nickname}</dd>
                </div>
                <div>
                  <dt>이메일</dt>
                  <dd>{member.email}</dd>
                </div>
              </dl>
            </div>
          </section>
          <section className="profile-favorites" aria-labelledby="favorites-title">
            <h2 id="favorites-title">내 즐겨찾기</h2>
            <FavoritesGrid />
          </section>
        </section>
      </main>
      <Footer logoSrc="/images/profile/tmdb-logo.svg" />
    </div>
  );
}
