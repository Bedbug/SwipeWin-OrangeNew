var User = (function () {
    function User() {
        this.id = null;
        this.msisdn = null;
        this.username = null;
        this.picture = null;
        this.age = 0;
        this.gender = 'male';
        this.createdAt = null;
        this.gamesPlayed = 0;
        this.bestScore = 0;
        this.bestScoreToday = 0;
        this.totalDaysPlaying = 0;
        this.wallet = null;
    }
    User.prototype.toProfileDTO = function () {
        return {
            id: this.id,
            username: this.username,
            age: this.age,
            gender: this.gender,
            msisdn: this.msisdn
        };
    };
    return User;
}());
;
