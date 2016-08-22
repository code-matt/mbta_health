class Event < ActiveRecord::Base
  validates :sch_arr_dt, :sch_dep_dt, :mbta_trip_id, :trip_name, presence: true
  belongs_to :stop

  def self.parse_trip_name(txt)
    re1='.*?'	# Non-greedy match on filler
    re2='(\\(.*\\))'	# Round Braces 1

    re=(re1+re2)
    m=Regexp.new(re,Regexp::IGNORECASE);
    if m.match(txt)
        rbraces1=m.match(txt)[1];
        return rbraces1
    end
    false
  end
end